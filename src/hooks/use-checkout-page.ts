
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
  // Use a ref to track if we've already performed initial checks to avoid duplicates
  const authCheckCompletedRef = useRef(false);
  const [directSession, setDirectSession] = useState<any>(null);
  
  // Set a maximum number of auth check attempts and track them
  const MAX_AUTH_CHECKS = 1;
  const [authCheckCount, setAuthCheckCount] = useState(0);

  // Check Supabase session directly only once on component mount
  useEffect(() => {
    // If we've already completed auth checks, don't do anything
    if (authCheckCompletedRef.current) return;
    
    const checkDirectSession = async () => {
      try {
        // Mark that we've begun checking authentication
        authCheckCompletedRef.current = true;
        
        const { data } = await supabase.auth.getSession();
        console.log("[Checkout] Direct session check:", data?.session?.user?.id);
        
        if (data?.session) {
          setDirectSession(data.session);
          setHasValidSession(true);
          setIsAuthChecked(true);
          setIsInitialized(true);
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

  // Check session hook only if direct check didn't find a valid session
  useEffect(() => {
    // If we already have a valid session or we've reached max attempts, don't continue
    if (hasValidSession || authCheckCount >= MAX_AUTH_CHECKS) return;
    
    // If session from hook is available, use it
    if (session?.user?.id) {
      console.log("[Checkout] Session from hook:", session.user.id);
      setHasValidSession(true);
      setIsAuthChecked(true);
      setIsInitialized(true);
      return;
    }
    
    // If we've done both checks and still don't have a session
    if (authCheckCount === MAX_AUTH_CHECKS - 1 && !hasValidSession) {
      console.log("[Checkout] No valid session found after all checks");
      setIsAuthChecked(true);
      setIsInitialized(true);
    }
    
    setAuthCheckCount(prev => prev + 1);
  }, [session, directSession, hasValidSession, authCheckCount]);

  // Check empty cart only after confirming user authentication status
  useEffect(() => {
    if (isInitialized && cartItems.length === 0) {
      console.log("[Checkout] Empty cart, redirecting to /cart");
      navigate("/cart");
    }
  }, [isInitialized, cartItems.length, navigate]);

  return {
    isInitialized,
    isAuthChecked,
    hasValidSession: hasValidSession || Boolean(session?.user),
    cartItems,
    session: session || directSession,
    clear
  };
};
