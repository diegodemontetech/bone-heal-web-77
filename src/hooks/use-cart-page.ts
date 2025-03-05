
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CartItem } from "@/hooks/use-cart";

export function useCartPage() {
  const session = useSession();
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const calculateShipping = async () => {
    if (!zipCode || zipCode.length !== 8) {
      toast.error("Por favor, insira um CEP válido");
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);
    
    try {
      // Primeiro, vamos obter o estado do CEP usando a API dos Correios
      const { data: correiosData, error: correiosError } = await supabase.functions.invoke("correios-shipping", {
        body: {
          zipCodeDestination: zipCode,
        },
      });

      if (correiosError) throw correiosError;

      // Agora vamos buscar a taxa de frete baseada no estado
      const { data: shippingRate, error: shippingError } = await supabase
        .from('shipping_rates')
        .select('rate, delivery_days')
        .eq('state', correiosData.state)
        .single();

      if (shippingError) throw shippingError;

      if (!shippingRate) {
        throw new Error("Não foi possível calcular o frete para este CEP");
      }

      setShippingCost(shippingRate.rate);
      toast.success(`Frete calculado: entrega em ${shippingRate.delivery_days} dias úteis`);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setShippingError("Erro ao calcular o frete. Por favor, tente novamente.");
      toast.error("Erro ao calcular o frete. Por favor, tente novamente.");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCheckout = (cartItems: CartItem[], subtotal: number, total: number) => {
    if (!session) {
      toast.error("Por favor, faça login para continuar");
      navigate("/login");
      return;
    }

    if (!shippingCost) {
      toast.error("Por favor, calcule o frete antes de continuar");
      return;
    }

    // Verificar se há itens no carrinho
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    console.log("Indo para checkout com itens:", cartItems);
    navigate("/checkout");
  };

  return {
    session,
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingCost,
    shippingError,
    calculateShipping,
    handleCheckout
  };
}
