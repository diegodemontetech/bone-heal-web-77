
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersErrorMessageProps {
  refetch: () => void;
}

const OrdersErrorMessage = ({ refetch }: OrdersErrorMessageProps) => {
  return (
    <div className="text-center py-16 bg-red-50 rounded-md">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
      <p className="text-red-600 font-medium">Erro ao carregar pedidos</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => refetch()}
      >
        Tentar novamente
      </Button>
    </div>
  );
};

export default OrdersErrorMessage;
