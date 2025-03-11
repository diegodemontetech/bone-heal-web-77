
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface TotalSummaryProps {
  calculateSubtotal: () => number;
  calculateDiscountAmount: () => number;
  calculateTotal: () => number;
  appliedVoucher: any;
}

const TotalSummary = ({
  calculateSubtotal,
  calculateDiscountAmount,
  calculateTotal,
  appliedVoucher,
}: TotalSummaryProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>{formatCurrency(calculateSubtotal())}</span>
      </div>
      <div className="flex justify-between">
        <span>Desconto:</span>
        <span className="text-red-500">- {formatCurrency(calculateDiscountAmount())}</span>
      </div>
      {appliedVoucher?.discount_type === "shipping" && (
        <div className="flex justify-between text-green-600">
          <span>Frete:</span>
          <span>Grátis</span>
        </div>
      )}
      <Separator />
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>{formatCurrency(calculateTotal())}</span>
      </div>
    </div>
  );
};

export default TotalSummary;
