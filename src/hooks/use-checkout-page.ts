
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const useCheckoutPage = () => {
  const { cartItems, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const authCheckRef = useRef(false);
  const [directSession, setDirectSession] = useState<any>(null);
  const sessionCheckedRef = useRef(false);
  
  // Additional authentication checks - limited to 3 attempts
  const [authCheckCount, setAuthCheckCount] = useState(0);
  const MAX_AUTH_CHECKS = 3;
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check Supabase session directly only once
  useEffect(() => {
    if (sessionCheckedRef.current) return;
    
    const checkDirectSession = async () => {
      sessionCheckedRef.current = true;
      
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[Checkout] Direct session check:", data?.session?.user?.id);
        
        if (data?.session) {
          setDirectSession(data.session);
          setHasValidSession(true);
          setIsAuthChecked(true);
          setIsInitialized(true);
          authCheckRef.current = true;
        } else {
          setIsAuthChecked(true);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error checking direct session:", error);
        setIsAuthChecked(true);
        setIsInitialized(true);
      }
    };
    
    checkDirectSession();
  }, []);

  // Check session only if we don't have a confirmed value yet
  // and limit the number of attempts
  useEffect(() => {
    if (authCheckRef.current || authCheckCount >= MAX_AUTH_CHECKS) return;
    
    const checkAuth = async () => {
      console.log(`[Checkout] Authentication check (attempt ${authCheckCount + 1}):`, {
        sessionHook: Boolean(session?.user?.id),
        directSession: Boolean(directSession?.user?.id)
      });
      
      setAuthCheckCount(prev => prev + 1);
      
      // If we have a session by any method, mark as authenticated
      if (session?.user?.id || directSession?.user?.id) {
        console.log(`[Checkout] Valid session found:`, session?.user?.id || directSession?.user?.id);
        setHasValidSession(true);
        setIsAuthChecked(true);
        setIsInitialized(true);
        authCheckRef.current = true;
        return;
      }
      
      // Last direct check
      if (authCheckCount < MAX_AUTH_CHECKS - 1) {
        console.log("[Checkout] Attempting to check session again with direct API...");
        
        try {
          const { data } = await supabase.auth.getSession();
          
          if (data?.session) {
            console.log("[Checkout] Valid session found in additional check");
            setDirectSession(data.session);
            setHasValidSession(true);
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      }
      
      setIsAuthChecked(true);
      setIsInitialized(true);
    };
    
    // Clear any existing timeout
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
    }
    
    // Execute with some delay between attempts
    authTimeoutRef.current = setTimeout(() => {
      checkAuth();
    }, 300 * (authCheckCount + 1)); // Increasing delay with each attempt
    
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, [session, directSession, authCheckCount]);

  // Check empty cart only after confirming user is authenticated
  useEffect(() => {
    if (isInitialized && cartItems.length === 0) {
      console.log("[Checkout] Empty cart, redirecting to /cart");
      navigate("/cart");
    }
  }, [isInitialized, cartItems.length, navigate]);

  return {
    isInitialized,
    isAuthChecked,
    hasValidSession: hasValidSession || Boolean(session?.user),  // Redundancy for safety
    cartItems,
    session: session || directSession,
    clear
  };
};
