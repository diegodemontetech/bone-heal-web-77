
export const useQuotationCalculations = (
  selectedProducts: any[],
  discount: number,
  discountType: string,
  appliedVoucher: any = null,
  shippingCost: number = 0
) => {
  const calculateSubtotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    
    // Se tiver um cupom aplicado, usa o desconto dele
    if (appliedVoucher) {
      if (appliedVoucher.discount_type === "percentage") {
        return subtotal * (appliedVoucher.discount_amount / 100);
      } else if (appliedVoucher.discount_type === "fixed") {
        return appliedVoucher.discount_amount;
      } 
      // Se for frete grátis, não afeta o valor do produto diretamente
      return 0;
    }
    
    // Se não tiver cupom, usa o desconto manual (mantido para retrocompatibilidade)
    if (discountType === "percentage") {
      return subtotal * (discount / 100);
    } else {
      return discount;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    
    // Adiciona o frete, a menos que haja um cupom de frete grátis
    const isFreeShipping = appliedVoucher && appliedVoucher.discount_type === "shipping";
    const shippingAmount = isFreeShipping ? 0 : shippingCost;
    
    return subtotal - discountAmount + shippingAmount;
  };

  return {
    calculateSubtotal,
    calculateDiscountAmount,
    calculateTotal,
  };
};
