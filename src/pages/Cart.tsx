
import CartPage from "@/components/cart/CartPage";
import { useCart } from "@/hooks/use-cart";
import { Loader2 } from "lucide-react";
import { EmptyCart } from "@/components/cart/EmptyCart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Cart = () => {
  const { cartItems, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando seu carrinho...</p>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <EmptyCart />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return <CartPage />;
};

export default Cart;
