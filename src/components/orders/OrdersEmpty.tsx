
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrdersEmptyProps {
  navigate: (path: string) => void;
}

const OrdersEmpty = ({ navigate }: OrdersEmptyProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center">
          <Package className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">Você ainda não tem pedidos</h3>
          <p className="text-gray-600 mb-6">
            Visite nossa loja e faça seu primeiro pedido
          </p>
          <Button 
            className="bg-primary text-white"
            onClick={() => navigate("/products")}
          >
            Ver Produtos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersEmpty;
