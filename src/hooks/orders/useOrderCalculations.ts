
export const useOrderCalculations = () => {
  const calculateTotal = (selectedProducts: any[]) => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateDiscount = (subtotal: number, appliedVoucher: any) => {
    if (!appliedVoucher) return 0;

    if (appliedVoucher.discount_type === "percentage") {
      return (subtotal * appliedVoucher.discount_amount) / 100;
    } else if (appliedVoucher.discount_type === "fixed") {
      return Math.min(subtotal, appliedVoucher.discount_amount);
    }
    
    return 0;
  };

  return {
    calculateTotal,
    calculateDiscount
  };
};
