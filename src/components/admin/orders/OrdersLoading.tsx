
import { Loader2 } from "lucide-react";

const OrdersLoading = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-gray-500">Carregando pedidos...</p>
    </div>
  );
};

export default OrdersLoading;
