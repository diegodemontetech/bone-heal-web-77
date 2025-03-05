
import { useCart } from "@/hooks/use-cart";
import { useCartPage } from "@/hooks/use-cart-page";
import Navbar from "@/components/Navbar";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const {
    session,
    isAuthenticated,
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingCost,
    shippingError,
    calculateShipping,
    handleCheckout
  } = useCartPage();

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
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Carrinho</h1>

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
            calculateShipping={calculateShipping}
            handleCheckout={handleCheckout}
            session={session}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Cart;
