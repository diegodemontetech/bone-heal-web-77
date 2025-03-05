
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
      <Button onClick={() => navigate("/products")}>
        <ChevronLeft className="w-4 h-4 mr-2" />
        Voltar para produtos
      </Button>
    </div>
  );
};

export default ProductNotFound;
