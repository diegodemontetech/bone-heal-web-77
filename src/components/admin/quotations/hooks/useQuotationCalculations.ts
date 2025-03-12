
import { useMemo } from "react";

export const useQuotationCalculations = (
  selectedProducts: any[],
  discount: number,
  discountType: string,
  appliedVoucher: any,
  shippingCost: number = 0,
  paymentMethod: string = "pix"
) => {
  // Calcula o subtotal baseado nos produtos selecionados
  const calculateSubtotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  // Calcula o valor do desconto aplicado
  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    
    // Se houver um voucher aplicado, ele tem precedência
    if (appliedVoucher) {
      if (appliedVoucher.discount_type === "percentage") {
        return (subtotal * appliedVoucher.discount_amount) / 100;
      } else if (appliedVoucher.discount_type === "fixed") {
        return Math.min(subtotal, appliedVoucher.discount_amount);
      } else if (appliedVoucher.discount_type === "shipping") {
        return 0; // O desconto é no frete, não no valor dos produtos
      }
    }
    
    // Se não houver voucher, usar o desconto manual
    if (discountType === "percentage") {
      return (subtotal * discount) / 100;
    } else {
      return Math.min(subtotal, discount);
    }
  };

  // Calcula o valor do frete a ser cobrado
  const calculateShippingCost = () => {
    // Se o voucher for de frete grátis, retorna 0
    if (appliedVoucher?.discount_type === "shipping") {
      return 0;
    }
    
    return shippingCost;
  };

  // Calcula o valor total do orçamento
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const finalShippingCost = calculateShippingCost();
    
    return subtotal - discountAmount + finalShippingCost;
  };

  return {
    calculateSubtotal,
    calculateDiscountAmount,
    calculateShippingCost,
    calculateTotal
  };
};
