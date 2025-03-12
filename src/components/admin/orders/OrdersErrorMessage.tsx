
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersErrorMessageProps {
  refetch: () => void;
}

const OrdersErrorMessage = ({ refetch }: OrdersErrorMessageProps) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-red-900">Erro ao carregar pedidos</h3>
      <p className="mt-1 text-sm text-red-500">Ocorreu um erro ao carregar a lista de pedidos</p>
      <Button 
        variant="outline"
        className="mt-4"
        onClick={() => refetch()}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Tentar novamente
      </Button>
    </div>
  );
};

export default OrdersErrorMessage;
