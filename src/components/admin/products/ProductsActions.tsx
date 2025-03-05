
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ProductsActionsProps {
  onAddNew: () => void;
  onSync: () => void;
  isSyncing: boolean;
}

const ProductsActions = ({ onAddNew, onSync, isSyncing }: ProductsActionsProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Produtos</h1>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? "Sincronizando..." : "Sincronizar com Omie"}
        </Button>
        <Button onClick={onAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>
    </div>
  );
};

export default ProductsActions;
