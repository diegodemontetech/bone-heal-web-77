
import { Button } from "@/components/ui/button";

interface EmptyOrdersMessageProps {
  setIsCreating: (value: boolean) => void;
}

const EmptyOrdersMessage = ({ setIsCreating }: EmptyOrdersMessageProps) => {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-md">
      <p className="text-gray-500">Nenhum pedido encontrado</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => setIsCreating(true)}
      >
        Criar novo pedido
      </Button>
    </div>
  );
};

export default EmptyOrdersMessage;
