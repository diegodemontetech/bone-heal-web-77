
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface EmptyOrdersMessageProps {
  setIsCreating: (value: boolean) => void;
}

const EmptyOrdersMessage = ({ setIsCreating }: EmptyOrdersMessageProps) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-neutral-100 shadow-sm">
      <div className="bg-neutral-50 p-4 rounded-full mb-4">
        <Package className="h-10 w-10 text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium mb-1">Nenhum pedido encontrado</h3>
      <p className="text-sm text-neutral-500 mb-6">Comece criando um novo pedido</p>
      <Button 
        onClick={() => setIsCreating(true)}
        className="bg-primary hover:bg-primary-light"
      >
        <Plus className="h-4 w-4 mr-2" />
        Criar novo pedido
      </Button>
    </div>
  );
};

export default EmptyOrdersMessage;
