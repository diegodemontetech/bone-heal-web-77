
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useVoucher() {
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [discount, setDiscount] = useState(0);

  const applyVoucherDiscount = (voucher: any, subtotal: number, currentShippingFee: number) => {
    let discountValue = 0;

    if (voucher.discount_type === 'percentage') {
      if (voucher.discount_value === 100) {
        discountValue = currentShippingFee;
      } else {
        discountValue = (subtotal * voucher.discount_value) / 100;
      }
    } else if (voucher.discount_type === 'fixed') {
      discountValue = voucher.discount_value;
    }

    setDiscount(discountValue);
  };

  const applyVoucher = async (subtotal: number, shippingFee: number) => {
    if (!voucherCode) return;

    setVoucherLoading(true);
    try {
      const { data: voucher, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', voucherCode.toUpperCase())
        .single();

      if (error || !voucher) {
        setVoucherCode("");
        return;
      }

      const now = new Date();
      if (voucher.valid_until && new Date(voucher.valid_until) < now) {
        setVoucherCode("");
        return;
      }

      if (voucher.max_uses && voucher.current_uses >= voucher.max_uses) {
        setVoucherCode("");
        return;
      }
      
      if (voucher.min_amount && subtotal < voucher.min_amount) {
        setVoucherCode("");
        return;
      }

      applyVoucherDiscount(voucher, subtotal, shippingFee);
      setAppliedVoucher(voucher);
    } catch (error) {
      console.error("Erro ao aplicar cupom:", error);
    } finally {
      setVoucherLoading(false);
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setDiscount(0);
  };

  return {
    voucherCode,
    setVoucherCode,
    voucherLoading,
    appliedVoucher,
    discount,
    applyVoucher,
    removeVoucher
  };
}
