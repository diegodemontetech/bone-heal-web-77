
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface EmptyOrdersMessageProps {
  setIsCreating: (value: boolean) => void;
}

const EmptyOrdersMessage = ({ setIsCreating }: EmptyOrdersMessageProps) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
      <Package className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
      <p className="mt-1 text-sm text-gray-500">Comece criando um novo pedido</p>
      <Button 
        className="mt-4"
        onClick={() => setIsCreating(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Criar novo pedido
      </Button>
    </div>
  );
};

export default EmptyOrdersMessage;
