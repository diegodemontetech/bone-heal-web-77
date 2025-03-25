
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
      <div className="bg-gray-100 p-6 rounded-full inline-flex mb-6">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-3">Seu carrinho está vazio</h2>
      <p className="text-gray-500 mb-6">Adicione produtos ao seu carrinho para continuar com a compra.</p>
      <Button 
        onClick={() => navigate("/products")}
        className="bg-primary hover:bg-primary/90 text-white px-8 py-2"
        size="lg"
      >
        Explorar produtos
      </Button>
    </div>
  );
};
