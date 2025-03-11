
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ShippingRatesEmptyStateProps {
  onAddRate: () => void;
}

export const ShippingRatesEmptyState: React.FC<ShippingRatesEmptyStateProps> = ({ onAddRate }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">Nenhuma taxa de envio encontrada. Configure sua primeira taxa.</p>
      <Button onClick={onAddRate}>
        <Plus className="mr-2 h-4 w-4" />
        Configurar Taxa
      </Button>
    </div>
  );
};
