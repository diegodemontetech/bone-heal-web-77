
import React, { useEffect } from "react";
import CartPage from "@/components/cart/CartPage";
import { useCart } from "@/hooks/use-cart";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Cart = () => {
  const { cartItems, isLoading } = useCart();
  
  console.log("Página Cart renderizando, itens:", cartItems?.length, "isLoading:", isLoading);

  // Mostrar o layout da página independentemente da situação do carrinho
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>
        <CartPage />
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Cart;
