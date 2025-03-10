
// Atualizando importação no use-cart-page.ts que pode usar o hook de shipping
import { useState, useEffect } from "react";
import { useCart } from "./use-cart";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

// Importe do novo caminho
import { useShippingRates, useUserZipCode } from "./shipping";

export const useCartPage = () => {
  const { cartItems, clear } = useCart(); // Corrigido de clearCart para clear
  const navigate = useNavigate();
  const session = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    setIsAuthenticated(!!session);
  }, [session]);

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
    if (!isAuthenticated) {
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
};
