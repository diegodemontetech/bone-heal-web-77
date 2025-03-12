
import { useSelectedProducts } from "./useSelectedProducts";
import { useQuotationFormState } from "./form/useQuotationFormState";
import { useQuotationSubmit } from "./form/useQuotationSubmit";

export const useQuotationForm = ({ onCancel }: { onCancel: () => void }) => {
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
    appliedVoucher,
    setAppliedVoucher,
    zipCode,
    setZipCode,
    selectedShipping,
    setSelectedShipping,
  } = useQuotationFormState();
  
  // Gerenciamento de produtos
  const { 
    selectedProducts, 
    setSelectedProducts, 
    handleProductQuantityChange 
  } = useSelectedProducts();
  
  // Submissão e cálculos
  const {
    loading,
    handleCreateQuotation,
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
