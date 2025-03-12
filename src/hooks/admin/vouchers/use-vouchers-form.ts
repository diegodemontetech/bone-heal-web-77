
import { useState } from "react";
import { VoucherFormData, Voucher } from "@/types/voucher";

export const useVouchersForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState<VoucherFormData>({
    code: "",
    discount_type: "percentage",
    discount_amount: 0,
    min_amount: undefined,
    min_items: undefined,
    payment_method: undefined,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: undefined,
    max_uses: undefined,
    is_active: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_amount: 0,
      min_amount: undefined,
      min_items: undefined,
      payment_method: undefined,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: undefined,
      max_uses: undefined,
      is_active: true
    });
    setCurrentVoucher(null);
    setIsEditing(false);
  };

  const openEditDialog = (voucher: Voucher) => {
    setCurrentVoucher(voucher);
    setFormData({
      code: voucher.code,
      discount_type: voucher.discount_type,
      discount_amount: voucher.discount_amount,
      min_amount: voucher.min_amount,
      min_items: voucher.min_items,
      payment_method: voucher.payment_method || undefined,
      valid_from: new Date(voucher.valid_from).toISOString().split('T')[0],
      valid_until: voucher.valid_until ? new Date(voucher.valid_until).toISOString().split('T')[0] : undefined,
      max_uses: voucher.max_uses,
      is_active: voucher.is_active !== undefined ? voucher.is_active : true
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    currentVoucher,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog
  };
};
