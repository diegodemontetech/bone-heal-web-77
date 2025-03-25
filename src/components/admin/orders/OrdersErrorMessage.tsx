
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersErrorMessageProps {
  refetch: () => void;
}

const OrdersErrorMessage = ({ refetch }: OrdersErrorMessageProps) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-red-100 shadow-sm">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="h-10 w-10 text-red-400" />
      </div>
      <h3 className="text-lg font-medium mb-1 text-red-700">Erro ao carregar pedidos</h3>
      <p className="text-sm text-red-500 mb-6">Ocorreu um erro ao carregar a lista de pedidos</p>
      <Button 
        variant="outline"
        className="border-red-200 text-red-700 hover:bg-red-50"
        onClick={() => refetch()}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Tentar novamente
      </Button>
    </div>
  );
};

export default OrdersErrorMessage;
