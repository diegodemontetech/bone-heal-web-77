
import { useCart } from "@/hooks/use-cart";
import { useCartPage } from "@/hooks/use-cart-page";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const {
    session,
    isAuthenticated,
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingCost,
    shippingError,
    calculateShipping,
    handleCheckout: originalHandleCheckout,
    shippingCalculated,
    resetShipping
  } = useCartPage();

  // Modificar o handleCheckout para passar informações de frete para a página de checkout
  const handleCheckout = (cartItems, subtotal, total) => {
    // Se o frete foi calculado, vamos passar as informações para o checkout
    if (shippingCalculated && zipCode) {
      navigate("/checkout", { 
        state: { 
          shipping: {
            zipCode: zipCode,
            cost: shippingCost
          }
        }
      });
    } else {
      // Comportamento padrão
      originalHandleCheckout(cartItems, subtotal, total);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <EmptyCart />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Seu Carrinho</h1>
        </div>
        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem 
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))}
          </div>

          {/* Summary */}
          <CartSummary
            cartItems={cartItems}
            zipCode={zipCode}
            setZipCode={setZipCode}
            isCalculatingShipping={isCalculatingShipping}
            shippingCost={shippingCost}
            shippingError={shippingError}
            calculateShipping={calculateShipping} // A função wrapper agora não precisa de argumentos
            handleCheckout={handleCheckout}
            session={session}
            isAuthenticated={isAuthenticated}
            shippingCalculated={shippingCalculated}
            resetShipping={resetShipping}
          />
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Cart;
