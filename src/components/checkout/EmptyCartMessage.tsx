
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const EmptyCartMessage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 flex-1">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
          <Button 
            onClick={() => navigate("/products")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Continuar comprando
          </Button>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default EmptyCartMessage;
