
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface OrdersHeaderProps {
  setIsCreating: (value: boolean) => void;
}

const OrdersHeader = ({ setIsCreating }: OrdersHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Gerenciamento de Pedidos</h1>
      <Button onClick={() => setIsCreating(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Pedido
      </Button>
    </div>
  );
};

export default OrdersHeader;
