
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

const OrderLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600">Carregando detalhes do pedido...</p>
    </div>
  );
};

export default OrderLoading;
