
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

// Corrigir importações para usar named exports
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

const Cart = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { cart, isLoading, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { 
    zipCode, 
    setZipCode, 
    shippingCost, 
    calculateShipping, 
    isCalculatingShipping, 
    shippingError, 
    shippingCalculated,
    resetShipping 
  } = useShipping();
  
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

  // Reset shipping when cart changes
  useEffect(() => {
    resetShipping();
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
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                cartTotal={getTotalPrice()}
                shippingCost={shippingCost}
                zipCode={zipCode}
                setZipCode={setZipCode}
                calculateShipping={(zip) => calculateShipping(zip)} // Corrigir a assinatura do método
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
