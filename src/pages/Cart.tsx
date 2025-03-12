
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { useCart } from "@/hooks/use-cart";
import { useShipping } from "@/hooks/use-shipping";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";

// Importar componentes corretamente usando importações nomeadas
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

const Cart = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { cart, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  // Extrair valores do hook de shipping
  const { 
    zipCode, 
    setZipCode, 
    shippingFee: shippingCost, 
    calculateShipping, 
    loading: isCalculatingShipping, 
    resetShipping
  } = useShipping();
  
  // Estados adicionais necessários para o componente
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingCalculated, setShippingCalculated] = useState(false);

  // Função para lidar com o checkout
  const handleCheckout = () => {
    if (!profile) {
      toast.error("É necessário estar logado para finalizar a compra");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!shippingCalculated) {
      toast.error("Por favor, calcule o frete antes de continuar");
      return;
    }

    navigate("/checkout");
  };

  // Wrapper para calculateShipping para lidar com os estados
  const handleCalculateShipping = async (zip: string) => {
    setShippingError(null);
    try {
      await calculateShipping(zip);
      setShippingCalculated(true);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setShippingError("Erro ao calcular o frete. Verifique o CEP e tente novamente.");
      setShippingCalculated(false);
    }
  };

  // Reset shipping when cart changes
  useEffect(() => {
    resetShipping();
    setShippingCalculated(false);
  }, [cart, resetShipping]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Meu Carrinho
        </h1>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  removeFromCart={() => removeItem(item.id)}
                  updateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                cartTotal={getTotalPrice()}
                shippingCost={shippingCost || 0}
                zipCode={zipCode}
                setZipCode={setZipCode}
                calculateShipping={handleCalculateShipping}
                isCalculatingShipping={isCalculatingShipping}
                shippingError={shippingError}
                shippingCalculated={shippingCalculated}
              />

              <div className="mt-4">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  disabled={cart.length === 0 || !shippingCalculated}
                >
                  Finalizar Compra
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Cart;
