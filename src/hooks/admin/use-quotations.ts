
import { useState } from "react";
import { useSelectedProducts } from "@/components/admin/quotations/hooks/useSelectedProducts";
import { useQuotationCalculations } from "@/components/admin/quotations/hooks/useQuotationCalculations";
import { useCreateQuotation } from "@/components/admin/quotations/hooks/useCreateQuotation";

export const useQuotationForm = ({ onCancel }: { onCancel: () => void }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  
  const { 
    selectedProducts, 
    setSelectedProducts, 
    handleProductQuantityChange 
  } = useSelectedProducts();
  
  const { 
    calculateSubtotal, 
    calculateDiscountAmount, 
    calculateTotal 
  } = useQuotationCalculations(selectedProducts, discount, discountType, appliedVoucher);
  
  const { loading, createQuotation } = useCreateQuotation(onCancel);

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
      appliedVoucher
    );
  };

  return {
    selectedCustomer,
    setSelectedCustomer,
    selectedProducts,
    setSelectedProducts,
    paymentMethod,
    setPaymentMethod,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    appliedVoucher,
    setAppliedVoucher,
    loading,
    handleProductQuantityChange,
    handleCreateQuotation,
  };
};
