
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="mb-6">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
      <p className="text-gray-600 mb-8">
        Que tal explorar nossos produtos e encontrar algo especial?
      </p>
      <Button
        size="lg"
        className="w-full"
        onClick={() => navigate("/products")}
      >
        Ver Produtos
      </Button>
      <p className="mt-4 text-sm text-gray-500">
        Ou volte para a <Button variant="link" className="p-0" onClick={() => navigate("/")}>página inicial</Button>
      </p>
    </div>
  );
};
