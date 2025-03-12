
import { useState } from "react";

export const useQuotationFormState = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("percentage");
  
  return {
    selectedCustomer,
    setSelectedCustomer,
    paymentMethod,
    setPaymentMethod,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
  };
};
