
import { useState } from "react";
import { useSelectedProducts } from "./useSelectedProducts";
import { useQuotationCalculations } from "./useQuotationCalculations";
import { useCreateQuotation } from "./useCreateQuotation";
import { ShippingCalculationRate } from "@/types/shipping";

export const useQuotationForm = ({ onCancel }: { onCancel: () => void }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);
  
  const { 
    selectedProducts, 
    setSelectedProducts, 
    handleProductQuantityChange 
  } = useSelectedProducts();
  
  const { 
    calculateSubtotal, 
    calculateDiscountAmount, 
    calculateTotal 
  } = useQuotationCalculations(selectedProducts, discount, discountType, appliedVoucher, selectedShipping?.rate || 0);
  
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
      appliedVoucher,
      selectedShipping
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
    zipCode,
    setZipCode,
    selectedShipping,
    setSelectedShipping,
    loading,
    handleProductQuantityChange,
    handleCreateQuotation,
  };
};
