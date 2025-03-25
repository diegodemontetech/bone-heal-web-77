
import { Loader2 } from "lucide-react";

const OrdersLoading = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-neutral-100 shadow-sm">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-neutral-500">Carregando pedidos...</p>
    </div>
  );
};

export default OrdersLoading;
