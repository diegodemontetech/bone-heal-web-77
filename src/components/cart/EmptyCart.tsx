
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  console.log("[EmptyCart] Renderizando EmptyCart");
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-100 p-6 rounded-full inline-block mb-6">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Seu carrinho está vazio</h2>
        
        <p className="text-muted-foreground mb-8">
          Parece que você ainda não adicionou nenhum produto ao seu carrinho. Explore nossos produtos e aproveite as ofertas especiais.
        </p>
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-md"
          onClick={() => navigate("/products")}
          size="lg"
        >
          Ver produtos
        </Button>
      </div>
    </div>
  );
};
