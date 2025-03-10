
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
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Verificar diretamente a sessão do Supabase além do hook de sessão
  useEffect(() => {
    const checkDirectSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setDirectSession(data.session);
      }
    };
    
    checkDirectSession();
  }, []);

  // Verificar a sessão apenas uma vez no carregamento
  useEffect(() => {
    if (authCheckRef.current) return;
    authCheckRef.current = true;

    const checkAuth = async () => {
      console.log("Verificando sessão na página de checkout:", session || directSession);
      
      // Se tivermos sessão por qualquer um dos métodos
      if (session?.user?.id || directSession?.user?.id) {
        setHasValidSession(true);
        setIsAuthChecked(true);
        setIsInitialized(true);
      } else {
        console.log("Nenhuma sessão válida encontrada no checkout");
        setIsAuthChecked(true);
        
        // Evitamos redirecionar múltiplas vezes
        if (!redirectAttempted) {
          setRedirectAttempted(true);
          
          // Salva a página atual para redirecionamento após login
          toast.error("Você precisa estar logado para finalizar a compra");
          navigate("/login", { state: { from: location.pathname } });
        }
      }
    };
    
    checkAuth();
  }, [session, directSession, navigate, location.pathname, redirectAttempted]);

  // Verificar carrinho vazio apenas após confirmar que o usuário está autenticado
  useEffect(() => {
    if (isInitialized && hasValidSession && cartItems.length === 0) {
      console.log("Carrinho vazio, redirecionando para /cart");
      navigate("/cart");
    }
  }, [isInitialized, hasValidSession, cartItems.length, navigate]);

  return {
    isInitialized,
    isAuthChecked,
    hasValidSession,
    cartItems,
    session: session || directSession,
    clear
  };
};
