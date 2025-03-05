
import { ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const CheckoutLoading = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 flex-1 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
          <p className="text-gray-500">Carregando checkout...</p>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CheckoutLoading;
