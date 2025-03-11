
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface TotalSummaryProps {
  calculateSubtotal: () => number;
  calculateDiscountAmount: () => number;
  calculateTotal: () => number;
  appliedVoucher: any;
  shippingCost?: number;
}

const TotalSummary = ({
  calculateSubtotal,
  calculateDiscountAmount,
  calculateTotal,
  appliedVoucher,
  shippingCost = 0
}: TotalSummaryProps) => {
  const isFreeShipping = appliedVoucher?.discount_type === "shipping";

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>{formatCurrency(calculateSubtotal())}</span>
      </div>
      
      {calculateDiscountAmount() > 0 && (
        <div className="flex justify-between">
          <span>Desconto:</span>
          <span className="text-red-500">- {formatCurrency(calculateDiscountAmount())}</span>
        </div>
      )}
      
      <div className="flex justify-between">
        <span>Frete:</span>
        {isFreeShipping ? (
          <span className="text-green-600">Grátis</span>
        ) : (
          <span>{formatCurrency(shippingCost)}</span>
        )}
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>{formatCurrency(calculateTotal())}</span>
      </div>
    </div>
  );
};

export default TotalSummary;
