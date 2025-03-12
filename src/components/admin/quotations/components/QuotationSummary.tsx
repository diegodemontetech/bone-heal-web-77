
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import VoucherSection from "./summary/VoucherSection";
import PaymentMethodSelector from "./summary/PaymentMethodSelector";
import TotalSummary from "./summary/TotalSummary";
import ActionButtons from "./summary/ActionButtons";
import { useQuotationCalculations } from "../hooks/useQuotationCalculations";
import ShippingSection from "./summary/ShippingSection";
import { ShippingCalculationRate } from "@/types/shipping";

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

/**
 * Componente que exibe o resumo e permite editar informações de um orçamento
 */
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
  // Estados locais
  const [voucherCode, setVoucherCode] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);
  
  // Hook de cálculos
  const { 
    calculateSubtotal, 
    calculateDiscountAmount, 
    calculateTotal 
  } = useQuotationCalculations(
    selectedProducts, 
    discount, 
    discountType, 
    appliedVoucher,
    selectedShipping?.rate || 0
  );

  // Calcula o total de itens no orçamento
  const totalItems = selectedProducts.reduce((total, item) => total + item.quantity, 0);

  // Atualizar o zipCode quando o cliente mudar
  useEffect(() => {
    if (selectedCustomer?.zip_code) {
      setZipCode(selectedCustomer.zip_code);
    }
  }, [selectedCustomer]);

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
          
          <ShippingSection 
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
            customerZipCode={selectedCustomer?.zip_code}
          />
          
          <TotalSummary
            calculateSubtotal={calculateSubtotal}
            calculateDiscountAmount={calculateDiscountAmount}
            calculateTotal={calculateTotal}
            appliedVoucher={appliedVoucher}
            shippingCost={selectedShipping?.rate || 0}
          />
          
          <ActionButtons
            selectedCustomer={selectedCustomer}
            selectedProducts={selectedProducts}
            loading={loading}
            onCreateQuotation={onCreateQuotation}
            onCancel={onCancel}
            disabled={!selectedCustomer || selectedProducts.length === 0}
            shippingInfo={selectedShipping}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationSummary;
