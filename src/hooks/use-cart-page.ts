
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";

export function useCartPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const { profile } = useAuth();
  const [zipCode, setZipCode] = useState("");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [lastCalculatedZip, setLastCalculatedZip] = useState<string>("");

  // Verifica o status da sessão ao carregar o componente
  useEffect(() => {
    const checkSession = async () => {
      if (hasAttemptedFetch) return;
      
      setHasAttemptedFetch(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Se o usuário tem um profile, tenta preencher o CEP automaticamente
      if (profile?.zip_code) {
        setZipCode(profile.zip_code);
      }
    };
    
    checkSession();
  }, [hasAttemptedFetch, profile]);

  useEffect(() => {
    // Limpar erro de frete quando o CEP muda
    if (zipCode.length > 0) {
      setShippingError(null);
    }
    
    // Resetar cálculo de frete quando o CEP muda
    if (zipCode !== lastCalculatedZip) {
      setShippingCalculated(false);
      setShippingCost(null);
    }
  }, [zipCode, lastCalculatedZip]);

  // Determina se o usuário está autenticado verificando tanto a sessão quanto o perfil
  const isAuthenticated = !!session?.user?.id || !!profile?.id;

  const calculateShipping = async () => {
    if (!zipCode || zipCode.length !== 8) {
      setShippingError("Por favor, insira um CEP válido com 8 dígitos");
      return;
    }

    // Evita recálculos desnecessários
    if (isCalculatingShipping) {
      return;
    }
    
    // Verifica se já calculamos para este CEP
    if (lastCalculatedZip === zipCode && shippingCalculated && shippingCost !== null) {
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);
    
    try {
      console.log(`Enviando requisição para calcular frete com CEP: ${zipCode}`);
      
      const { data, error } = await supabase.functions.invoke("correios-shipping", {
        body: {
          zipCode: zipCode,
          zipCodeDestination: zipCode,
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
      setShippingCalculated(true);
      setLastCalculatedZip(zipCode);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setShippingError("Erro ao calcular o frete. Por favor, tente novamente.");
      setShippingCost(null);
      setShippingCalculated(false);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const resetShipping = () => {
    setShippingCalculated(false);
    setShippingCost(null);
    setLastCalculatedZip("");
  }

  const handleCheckout = (cartItems: CartItem[], subtotal: number, total: number) => {
    // Verificar se há itens no carrinho
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    if (!shippingCost) {
      toast.error("Por favor, calcule o frete antes de finalizar a compra");
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
    handleCheckout,
    shippingCalculated,
    resetShipping
  };
}
