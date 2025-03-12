
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";

interface OrdersHeaderProps {
  setIsCreating: (value: boolean) => void;
}

const OrdersHeader = ({ setIsCreating }: OrdersHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie todos os pedidos da plataforma
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Importar
        </Button>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
