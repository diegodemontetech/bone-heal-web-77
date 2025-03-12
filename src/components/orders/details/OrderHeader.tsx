
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const OrderHeader = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate("/orders")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Detalhes do Pedido</h1>
      </div>
      <Separator className="mb-8" />
    </>
  );
};

export default OrderHeader;
