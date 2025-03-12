
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ShippingCalculationRate } from "@/types/shipping";

interface ActionButtonsProps {
  selectedCustomer: any;
  selectedProducts: any[];
  loading: boolean;
  disabled?: boolean;
  onCreateQuotation: () => void;
  onCancel: () => void;
  shippingInfo?: ShippingCalculationRate | null;
}

const ActionButtons = ({
  selectedCustomer,
  selectedProducts,
  loading,
  disabled = false,
  onCreateQuotation,
  onCancel,
  shippingInfo
}: ActionButtonsProps) => {
  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        onClick={onCreateQuotation}
        disabled={loading || disabled || !selectedCustomer || selectedProducts.length === 0}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Criando Orçamento...
          </>
        ) : (
          'Criar Orçamento'
        )}
      </Button>
      
      <Button
        variant="outline"
        className="w-full"
        onClick={onCancel}
        disabled={loading}
      >
        Cancelar
      </Button>
    </div>
  );
};

export default ActionButtons;
