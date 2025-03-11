
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SummarySectionProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  discountType?: string;
}

export const SummarySection = ({ 
  subtotal, 
  discount, 
  shipping, 
  total,
  discountType
}: SummarySectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Resumo</h3>
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Desconto{discountType === 'percentage' ? ' (%)' : ''}</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          {shipping > 0 && (
            <div className="flex justify-between">
              <span>Frete</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
