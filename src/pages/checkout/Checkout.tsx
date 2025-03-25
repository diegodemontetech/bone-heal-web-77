
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading } = useCart();

  useEffect(() => {
    // Only redirect if the cart is empty and not still loading
    if (!isLoading && (!cartItems || cartItems.length === 0)) {
      navigate('/cart');
    }
  }, [navigate, cartItems, isLoading]);

  // Show loading state while determining cart status
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando checkout...</p>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  // If cart has items, we'll stay on this page
  if (cartItems && cartItems.length > 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
            <p className="text-muted-foreground mb-8">
              Esta página está em construção. Em breve você poderá finalizar sua compra aqui.
            </p>
            
            <div className="py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p>Implementando métodos de pagamento...</p>
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  // This will only show briefly while redirecting to cart
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecionando para o carrinho...</p>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Checkout;
