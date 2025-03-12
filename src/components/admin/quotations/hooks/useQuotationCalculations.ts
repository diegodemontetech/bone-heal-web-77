
interface DiscountInfo {
  discount: number;
  discountType: string;
  appliedVoucher: any | null;
  paymentMethod?: string;
}

interface ShippingInfo {
  shippingCost: number;
  isFreeShipping?: boolean;
}

/**
 * Hook que fornece funções para cálculos relacionados a orçamentos
 */
export const useQuotationCalculations = (
  selectedProducts: any[],
  discount: number,
  discountType: string,
  appliedVoucher: any = null,
  shippingCost: number = 0,
  paymentMethod: string = "pix"
) => {
  /**
   * Calcula o subtotal dos produtos selecionados
   */
  const calculateSubtotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  /**
   * Calcula o valor do desconto baseado no cupom ou no desconto manual
   */
  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    
    // Se tiver um cupom aplicado, usa o desconto dele
    if (appliedVoucher) {
      return calculateVoucherDiscount(subtotal, appliedVoucher);
    }
    
    // Se não tiver cupom, usa o desconto manual e condições comerciais
    return calculateManualDiscount(subtotal, { 
      discount, 
      discountType, 
      appliedVoucher: null,
      paymentMethod 
    });
  };

  /**
   * Calcula o valor do desconto manual, considerando condições comerciais
   */
  const calculateManualDiscount = (subtotal: number, discountInfo: DiscountInfo) => {
    const { discount, discountType, paymentMethod } = discountInfo;
    
    // Desconto básico (manual)
    let discountAmount = 0;
    if (discountType === "percentage") {
      discountAmount = subtotal * (discount / 100);
    } else {
      discountAmount = discount;
    }
    
    // Adicionar descontos de condição comercial (como desconto de PIX)
    // Aqui poderia consultar a tabela de condições comerciais, mas
    // por simplicidade, aplicamos diretamente
    if (paymentMethod === "pix") {
      // Desconto adicional para PIX (5%)
      discountAmount += subtotal * 0.05;
    }
    
    return discountAmount;
  };

  /**
   * Calcula o valor do desconto de cupom
   */
  const calculateVoucherDiscount = (subtotal: number, voucher: any) => {
    if (voucher.discount_type === "percentage") {
      return subtotal * (voucher.discount_amount / 100);
    } else if (voucher.discount_type === "fixed") {
      return voucher.discount_amount;
    } 
    // Se for frete grátis, não afeta o valor do produto diretamente
    return 0;
  };

  /**
   * Verifica se o frete é grátis baseado no cupom aplicado
   */
  const isFreeShipping = () => {
    return appliedVoucher && appliedVoucher.discount_type === "shipping";
  };

  /**
   * Calcula o valor total do orçamento
   */
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    
    // Adiciona o frete, a menos que haja um cupom de frete grátis
    const shippingAmount = isFreeShipping() ? 0 : shippingCost;
    
    return subtotal - discountAmount + shippingAmount;
  };

  /**
   * Retorna informações de frete para uso em componentes
   */
  const getShippingInfo = (): ShippingInfo => {
    return {
      shippingCost,
      isFreeShipping: isFreeShipping()
    };
  };

  return {
    calculateSubtotal,
    calculateDiscountAmount,
    calculateTotal,
    calculateManualDiscount,
    calculateVoucherDiscount,
    isFreeShipping,
    getShippingInfo
  };
};
