
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  selectedCustomer: any;
  selectedProducts: any[];
  loading: boolean;
  onCreateQuotation: () => void;
  onCancel: () => void;
}

const ActionButtons = ({
  selectedCustomer,
  selectedProducts,
  loading,
  onCreateQuotation,
  onCancel,
}: ActionButtonsProps) => {
  return (
    <div className="pt-4 space-y-2">
      <Button
        className="w-full"
        disabled={!selectedCustomer || selectedProducts.length === 0 || loading}
        onClick={onCreateQuotation}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            Criar Orçamento
          </>
        )}
      </Button>
      
      <Button variant="outline" className="w-full" onClick={onCancel} disabled={loading}>
        Cancelar
      </Button>
    </div>
  );
};

export default ActionButtons;
