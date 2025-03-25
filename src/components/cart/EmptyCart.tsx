
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <ShoppingCart className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-4 uppercase">Seu carrinho está vazio</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Visite nossa loja e adicione produtos ao seu carrinho para continuar.
      </p>
      <Button 
        onClick={() => navigate("/products")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold uppercase"
        size="lg"
      >
        Explorar Produtos
      </Button>
    </div>
  );
};
