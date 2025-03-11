
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DiscountSection from "./summary/DiscountSection";
import VoucherSection from "./summary/VoucherSection";
import PaymentMethodSelector from "./summary/PaymentMethodSelector";
import TotalSummary from "./summary/TotalSummary";
import ActionButtons from "./summary/ActionButtons";

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
  
  const calculateSubtotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    
    // Se tiver um cupom aplicado, usa o desconto dele
    if (appliedVoucher) {
      if (appliedVoucher.discount_type === "percentage") {
        return subtotal * (appliedVoucher.discount_value / 100);
      } else if (appliedVoucher.discount_type === "fixed") {
        return appliedVoucher.discount_value;
      } 
      // Se for frete grátis, não afeta o valor do produto diretamente
      return 0;
    }
    
    // Se não tiver cupom, usa o desconto manual
    if (discountType === "percentage") {
      return subtotal * (discount / 100);
    } else {
      return discount;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    return subtotal - discountAmount;
  };

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
          />
          
          {!appliedVoucher && (
            <DiscountSection
              discountType={discountType}
              setDiscountType={setDiscountType}
              discount={discount}
              setDiscount={setDiscount}
            />
          )}
          
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
