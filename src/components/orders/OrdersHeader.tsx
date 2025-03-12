
import { ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const OrdersHeader = () => {
  return (
    <>
      <div className="flex items-center mb-6">
        <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Meus Pedidos</h1>
      </div>
      <Separator className="mb-8" />
    </>
  );
};

export default OrdersHeader;
