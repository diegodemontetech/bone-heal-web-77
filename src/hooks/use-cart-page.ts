
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";

export function useCartPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const { profile } = useAuth();
  const [zipCode, setZipCode] = useState("");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Verifica o status da sessão ao carregar o componente
  useEffect(() => {
    const checkSession = async () => {
      if (!hasAttemptedFetch) {
        setHasAttemptedFetch(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      }
    };
    
    checkSession();
  }, [hasAttemptedFetch]);

  useEffect(() => {
    // Limpar erro de frete quando o CEP muda
    if (zipCode.length > 0) {
      setShippingError(null);
    }
  }, [zipCode]);

  // Determina se o usuário está autenticado verificando tanto a sessão quanto o perfil
  const isAuthenticated = !!session?.user?.id || !!profile?.id;

  const calculateShipping = async () => {
    if (!zipCode || zipCode.length !== 8) {
      setShippingError("Por favor, insira um CEP válido com 8 dígitos");
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);
    
    try {
      console.log(`Enviando requisição para calcular frete com CEP: ${zipCode}`);
      
      const { data, error } = await supabase.functions.invoke("correios-shipping", {
        body: {
          zipCode: zipCode,
          zipCodeDestination: zipCode, // Adicionando como fallback
        },
      });

      if (error) {
        console.error("Erro na resposta da função:", error);
        throw error;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("Resposta inválida:", data);
        throw new Error("Resposta inválida do serviço de frete");
      }

      console.log("Resposta do cálculo de frete:", data);
      
      // Escolher a opção mais barata
      const cheapestRate = data.reduce((prev, curr) => 
        prev.rate < curr.rate ? prev : curr
      );
      
      setShippingCost(cheapestRate.rate);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setShippingError("Erro ao calcular o frete. Por favor, tente novamente.");
      setShippingCost(null);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCheckout = (cartItems: CartItem[], subtotal: number, total: number) => {
    // Verificar se há itens no carrinho
    if (cartItems.length === 0) {
      return;
    }

    if (!shippingCost) {
      return;
    }

    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    console.log("Indo para checkout com itens:", cartItems);
    navigate("/checkout");
  };

  return {
    session,
    isAuthenticated,
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingCost,
    shippingError,
    calculateShipping,
    handleCheckout
  };
}
