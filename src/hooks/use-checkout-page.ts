
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  
  // Verificações adicionais para autenticação
  const [lastAuthCheck, setLastAuthCheck] = useState(Date.now());
  const [authCheckCount, setAuthCheckCount] = useState(0);

  // Verificar diretamente a sessão do Supabase além do hook de sessão
  useEffect(() => {
    const checkDirectSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[Checkout] Verificando sessão direta:", data?.session?.user?.id);
        
        if (data?.session) {
          setDirectSession(data.session);
          setHasValidSession(true);
          setIsAuthChecked(true);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão direta:", error);
      }
    };
    
    checkDirectSession();
  }, []);

  // Verificar a sessão apenas uma vez no carregamento inicial
  useEffect(() => {
    const checkAuth = async () => {
      console.log(`[Checkout] Verificando autenticação (tentativa ${authCheckCount + 1}):`, {
        sessionHook: !!session?.user?.id,
        directSession: !!directSession?.user?.id
      });
      
      setAuthCheckCount(prev => prev + 1);
      
      // Se temos sessão por qualquer método, marcamos como autenticado
      if (session?.user?.id || directSession?.user?.id) {
        console.log(`[Checkout] Sessão válida encontrada:`, session?.user?.id || directSession?.user?.id);
        setHasValidSession(true);
        setIsAuthChecked(true);
        setIsInitialized(true);
        authCheckRef.current = true;
        return;
      }
      
      console.log("[Checkout] Tentando verificar sessão novamente com API direta...");
      
      // Verificar novamente a sessão diretamente para ter certeza
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[Checkout] Resultado de verificação adicional:", data?.session?.user?.id);
        
        if (data?.session) {
          console.log("[Checkout] Sessão válida encontrada na verificação adicional");
          setDirectSession(data.session);
          setHasValidSession(true);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
      
      setIsAuthChecked(true);
      setIsInitialized(true);
    };
    
    // Se a verificação não foi feita ou já passou muito tempo desde a última verificação
    if (!authCheckRef.current || Date.now() - lastAuthCheck > 5000) {
      setLastAuthCheck(Date.now());
      checkAuth();
    }
  }, [session, directSession, authCheckCount]);

  // Verificar carrinho vazio apenas após confirmar que o usuário está autenticado
  useEffect(() => {
    if (isInitialized && cartItems.length === 0) {
      console.log("[Checkout] Carrinho vazio, redirecionando para /cart");
      navigate("/cart");
    }
  }, [isInitialized, cartItems.length, navigate]);

  return {
    isInitialized,
    isAuthChecked,
    hasValidSession: hasValidSession || !!session?.user,  // Redundância para garantir
    cartItems,
    session: session || directSession,
    clear
  };
};
