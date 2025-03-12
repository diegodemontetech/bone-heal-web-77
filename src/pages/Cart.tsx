
// Importe os componentes usando named imports (não default)
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCart } from "@/hooks/use-cart";
import { useShipping } from "@/hooks/use-shipping";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, isLoading, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { 
    zipCode, 
    setZipCode, 
    loading: isCalculatingShipping, 
    shippingRates,
    selectedShippingRate,
    shippingFee: shippingCost,
    calculateShipping,
    resetShipping,
    handleShippingRateChange
  } = useShipping();
  const { session, isAuthenticated } = useAuth();
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingCalculated, setShippingCalculated] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (!shippingCalculated || !selectedShippingRate) {
      setShippingError("Por favor, calcule o frete antes de continuar");
      return;
    }

    navigate("/checkout");
  };

  const handleZipCodeSubmit = async (zip: string) => {
    setShippingError(null);
    try {
      await calculateShipping(zip);
      setShippingCalculated(true);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setShippingError("Não foi possível calcular o frete. Verifique o CEP e tente novamente.");
    }
  };

  const handleResetShipping = () => {
    resetShipping();
    setShippingCalculated(false);
    setShippingError(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <EmptyCart />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Meu Carrinho</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Itens ({getTotalItems()})</h2>

              <div className="divide-y">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                    onUpdateQuantity={(qty: number) => updateQuantity(item.id, qty)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <CartSummary
              subtotal={getTotalPrice()}
              shippingCost={shippingCost || 0}
              total={(getTotalPrice() + (shippingCost || 0))}
              zipCode={zipCode}
              onZipCodeChange={(e) => setZipCode(e.target.value)}
              onCalculateShipping={() => handleZipCodeSubmit(zipCode)}
              isLoading={isCalculatingShipping}
              error={shippingError}
              shippingCalculated={shippingCalculated}
              onResetShipping={handleResetShipping}
              onCheckout={handleCheckout}
              shippingOptions={shippingRates}
              selectedShippingOption={selectedShippingRate}
              onShippingOptionChange={handleShippingRateChange}
            />
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Cart;
