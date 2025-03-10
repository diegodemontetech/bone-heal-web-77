
import { useState, useEffect } from "react";
import { useCart } from "./use-cart";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Importe do novo caminho
import { useShippingRates, useUserZipCode } from "./shipping";

export const useCartPage = () => {
  const { cartItems, clear } = useCart();
  const navigate = useNavigate();
  const session = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [directSession, setDirectSession] = useState<any>(null);

  // Estado para o CEP e cálculo de frete
  const {
    zipCode,
    setZipCode,
  } = useUserZipCode();

  const {
    shippingRates,
    loading: isCalculatingShipping,
    calculateShipping: calculateShippingRates,
    resetShipping,
    selectedShippingRate
  } = useShippingRates();
  
  const shippingCost = selectedShippingRate ? selectedShippingRate.rate : null;

  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingCalculated, setShippingCalculated] = useState(false);

  // Verificar direto a sessão do Supabase além do hook useSession
  useEffect(() => {
    const checkDirectSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Verificando sessão direta no carrinho:", data?.session?.user);
        
        if (data?.session) {
          setDirectSession(data.session);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão direta:", error);
      }
    };
    
    checkDirectSession();
  }, []);

  useEffect(() => {
    // Verificar a autenticação usando o hook useSession e a verificação direta
    const hasSession = !!session?.user || !!directSession?.user;
    console.log("Atualizando estado de autenticação:", hasSession);
    setIsAuthenticated(hasSession);
  }, [session, directSession]);

  // Função wrapper para calculateShipping que não requer argumentos
  const calculateShipping = () => {
    if (zipCode && zipCode.length === 8 && cartItems.length > 0) {
      calculateShippingRates(zipCode, cartItems);
      setShippingCalculated(true);
    } else if (!zipCode || zipCode.length !== 8) {
      setShippingError("Por favor, informe um CEP válido com 8 dígitos");
    } else if (cartItems.length === 0) {
      setShippingError("Seu carrinho está vazio");
    }
  };

  // Função para lidar com o checkout
  const handleCheckout = (cartItems, subtotal, total) => {
    // Verificação dupla de autenticação
    const hasActiveSession = !!session?.user || !!directSession?.user;
    console.log("Verificação de autenticação no checkout:", hasActiveSession, isAuthenticated);
    
    if (!hasActiveSession) {
      toast.error("É necessário estar logado para finalizar a compra.");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!cartItems.length) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    navigate("/checkout");
  };

  return {
    session: session || directSession,
    isAuthenticated,
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingCost,
    shippingError,
    calculateShipping,
    handleCheckout,
    shippingCalculated,
    resetShipping
  };
};
