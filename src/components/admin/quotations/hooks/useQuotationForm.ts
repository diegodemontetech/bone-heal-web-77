
import { useState } from "react";
import { useSelectedProducts } from "./useSelectedProducts";
import { useQuotationCalculations } from "./useQuotationCalculations";
import { useCreateQuotation } from "./useCreateQuotation";

export const useQuotationForm = ({ onCancel }: { onCancel: () => void }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  
  const { 
    selectedProducts, 
    setSelectedProducts, 
    handleProductQuantityChange 
  } = useSelectedProducts();
  
  const { 
    calculateSubtotal, 
    calculateDiscountAmount, 
    calculateTotal 
  } = useQuotationCalculations(selectedProducts, discount, discountType);
  
  const { loading, createQuotation } = useCreateQuotation(onCancel);

  const handleCreateQuotation = async () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const total = calculateTotal();
    
    await createQuotation(
      selectedCustomer,
      selectedProducts,
      paymentMethod,
      discountType,
      subtotal,
      discountAmount,
      total
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
    loading,
    handleProductQuantityChange,
    handleCreateQuotation,
  };
};
