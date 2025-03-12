
import { useCreateQuotation } from "../useCreateQuotation";
import { useQuotationCalculations } from "../useQuotationCalculations";

interface UseQuotationSubmitProps {
  selectedCustomer: any;
  selectedProducts: any[];
  paymentMethod: string;
  discount: number;
  discountType: string;
  appliedVoucher: any;
  selectedShipping: any;
  onCancel: () => void;
}

export const useQuotationSubmit = ({
  selectedCustomer,
  selectedProducts,
  paymentMethod,
  discount,
  discountType,
  appliedVoucher,
  selectedShipping,
  onCancel
}: UseQuotationSubmitProps) => {
  const { loading, createQuotation } = useCreateQuotation(onCancel);
  
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

  const handleCreateQuotation = async () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const total = calculateTotal();
    
    await createQuotation(
      selectedCustomer,
      selectedProducts,
      paymentMethod,
      appliedVoucher ? "voucher" : discountType,
      subtotal,
      discountAmount,
      total,
      appliedVoucher,
      selectedShipping
    );
  };

  return {
    loading,
    handleCreateQuotation,
    calculateSubtotal,
    calculateDiscountAmount,
    calculateTotal
  };
};
