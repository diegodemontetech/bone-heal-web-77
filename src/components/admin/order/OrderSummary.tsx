
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface OrderSummaryProps {
  total: number;
  loading: boolean;
  onCreateOrder: () => void;
  onCancel: () => void;
  hasProducts: boolean;
}

export const OrderSummary = ({
  total,
  loading,
  onCreateOrder,
  onCancel,
  hasProducts,
}: OrderSummaryProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
        <div className="space-y-4">
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={onCreateOrder}
              disabled={loading || !hasProducts}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Criando Pedido...
                </>
              ) : (
                'Criar Pedido'
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
        </div>
      </CardContent>
    </Card>
  );
};
