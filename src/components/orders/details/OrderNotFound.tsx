
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">Pedido não encontrado</h3>
          <p className="text-gray-600 mb-6">
            Não conseguimos encontrar o pedido solicitado
          </p>
          <Button 
            className="bg-primary text-white"
            onClick={() => navigate("/orders")}
          >
            Ver Meus Pedidos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderNotFound;
