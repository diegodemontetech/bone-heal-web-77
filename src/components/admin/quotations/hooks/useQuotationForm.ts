
import { useState } from "react";
import { useSelectedProducts } from "./useSelectedProducts";
import { useQuotationFormState } from "./form/useQuotationFormState";
import { useQuotationSubmit } from "./form/useQuotationSubmit";
import { ShippingCalculationRate } from "@/types/shipping";

export const useQuotationForm = ({ onCancel, onSuccess }: { onCancel: () => void, onSuccess?: () => void }) => {
  // Estados do formulário
  const {
    selectedCustomer,
    setSelectedCustomer,
    paymentMethod,
    setPaymentMethod,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
  } = useQuotationFormState();
  
  // Estados adicionais
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);
  
  // Gerenciamento de produtos
  const { 
    selectedProducts, 
    setSelectedProducts, 
    handleProductQuantityChange 
  } = useSelectedProducts();
  
  // Submissão e cálculos
  const {
    loading,
    handleCreateQuotation: submitQuotation,
    calculateSubtotal,
    calculateDiscountAmount,
    calculateTotal
  } = useQuotationSubmit({
    selectedCustomer,
    selectedProducts,
    paymentMethod,
    discount,
    discountType,
    appliedVoucher,
    selectedShipping,
    onCancel
  });

  // Função para criar orçamento e chamar callback de sucesso
  const handleCreateQuotation = async () => {
    await submitQuotation();
    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    // Cliente
    selectedCustomer,
    setSelectedCustomer,
    
    // Produtos
    selectedProducts,
    setSelectedProducts,
    handleProductQuantityChange,
    
    // Pagamento
    paymentMethod,
    setPaymentMethod,
    
    // Desconto
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    
    // Cupom
    appliedVoucher,
    setAppliedVoucher,
    
    // Frete
    zipCode,
    setZipCode,
    selectedShipping,
    setSelectedShipping,
    
    // Cálculos
    calculateSubtotal,
    calculateDiscountAmount,
    calculateTotal,
    
    // Submissão
    loading,
    handleCreateQuotation,
  };
};
