
import { useState } from "react";
import { ShippingCalculationRate } from "@/types/shipping";

export const useQuotationFormState = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);

  return {
    // Cliente
    selectedCustomer,
    setSelectedCustomer,
    
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
  };
};
