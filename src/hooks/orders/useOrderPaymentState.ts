
import { useState } from "react";
import { ShippingCalculationRate } from "@/types/shipping";

export const useOrderPaymentState = () => {
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState<ShippingCalculationRate | null>(null);

  return {
    paymentMethod,
    setPaymentMethod,
    voucherCode,
    setVoucherCode,
    appliedVoucher,
    setAppliedVoucher,
    isApplyingVoucher,
    setIsApplyingVoucher,
    shippingFee,
    setShippingFee,
    selectedShipping,
    setSelectedShipping
  };
};
