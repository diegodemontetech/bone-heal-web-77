
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const useCheckoutPage = () => {
  const { cartItems, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const authCheckRef = useRef(false);

  // Verificar a sessão apenas uma vez no carregamento
  useEffect(() => {
    if (authCheckRef.current) return;
    authCheckRef.current = true;

    console.log("Verificando sessão na página de checkout:", session);
    
    if (session) {
      setHasValidSession(true);
      setIsAuthChecked(true);
      setIsInitialized(true);
    } else {
      console.log("Nenhuma sessão válida encontrada no checkout");
      setIsAuthChecked(true);
      toast.error("Você precisa estar logado para finalizar a compra");
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [session, navigate]);

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
    session,
    clear
  };
};
