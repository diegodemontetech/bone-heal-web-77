
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subtotal: number;
  discount?: number;
  shippingFee: number;
  total: number;
  loading: boolean;
  onCreateOrder: () => void;
  onCancel: () => void;
  hasProducts: boolean;
  paymentMethod: string;
  appliedVoucher?: any;
}

export const OrderSummary = ({
  subtotal,
  discount = 0,
  shippingFee,
  total,
  loading,
  onCreateOrder,
  onCancel,
  hasProducts,
  paymentMethod,
  appliedVoucher,
}: OrderSummaryProps) => {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'pix': return 'PIX';
      case 'credit_card': return 'Cartão de Crédito';
      case 'boleto': return 'Boleto Bancário';
      case 'transfer': return 'Transferência Bancária';
      default: return method;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" /> 
                  Desconto {appliedVoucher?.code && `(${appliedVoucher.code})`}
                </span>
                <span>- {formatCurrency(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Frete</span>
              <span>{formatCurrency(shippingFee)}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span className="text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <h3 className="font-medium mb-1">Detalhes do Pagamento</h3>
            <p className="text-sm text-muted-foreground">
              Método: {getPaymentMethodLabel(paymentMethod)}
            </p>
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
