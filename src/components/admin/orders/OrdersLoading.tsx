
import { Loader2 } from "lucide-react";

const OrdersLoading = () => {
  return (
    <div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};

export default OrdersLoading;
