
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import VoucherSection from "./summary/VoucherSection";
import PaymentMethodSelector from "./summary/PaymentMethodSelector";
import TotalSummary from "./summary/TotalSummary";
import ActionButtons from "./summary/ActionButtons";
import { useQuotationCalculations } from "../hooks/useQuotationCalculations";

interface QuotationSummaryProps {
  selectedCustomer: any;
  selectedProducts: any[];
  loading: boolean;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
  discountType: string;
  setDiscountType: (type: string) => void;
  onCreateQuotation: () => void;
  onCancel: () => void;
}

const QuotationSummary = ({
  selectedCustomer,
  selectedProducts,
  loading,
  paymentMethod,
  setPaymentMethod,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  onCreateQuotation,
  onCancel,
}: QuotationSummaryProps) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  
  const { 
    calculateSubtotal, 
    calculateDiscountAmount, 
    calculateTotal 
  } = useQuotationCalculations(selectedProducts, discount, discountType, appliedVoucher);

  const totalItems = selectedProducts.reduce((total, item) => total + item.quantity, 0);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resumo do Orçamento</h3>
        
        <div className="space-y-4">
          <PaymentMethodSelector 
            paymentMethod={paymentMethod} 
            setPaymentMethod={setPaymentMethod} 
          />
          
          <VoucherSection
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            isApplyingVoucher={isApplyingVoucher}
            setIsApplyingVoucher={setIsApplyingVoucher}
            appliedVoucher={appliedVoucher}
            setAppliedVoucher={setAppliedVoucher}
            paymentMethod={paymentMethod}
            subtotal={calculateSubtotal()}
            totalItems={totalItems}
          />
          
          <TotalSummary
            calculateSubtotal={calculateSubtotal}
            calculateDiscountAmount={calculateDiscountAmount}
            calculateTotal={calculateTotal}
            appliedVoucher={appliedVoucher}
          />
          
          <ActionButtons
            selectedCustomer={selectedCustomer}
            selectedProducts={selectedProducts}
            loading={loading}
            onCreateQuotation={onCreateQuotation}
            onCancel={onCancel}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationSummary;
