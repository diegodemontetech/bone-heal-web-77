
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface OrdersHeaderProps {
  setIsCreating: (isCreating: boolean) => void;
}

const OrdersHeader = ({ setIsCreating }: OrdersHeaderProps) => {
  const { refetch, isFetching } = useQuery({ queryKey: ["admin-orders"] });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie todos os pedidos da sua loja
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9"
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
        <Button 
          onClick={() => setIsCreating(true)}
          className="h-9 bg-primary"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
