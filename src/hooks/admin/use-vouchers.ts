
import { useVouchersData } from "./vouchers/use-vouchers-data";
import { useVouchersForm } from "./vouchers/use-vouchers-form";
import { useVouchersCrud } from "./vouchers/use-vouchers-crud";
import { useDateFormat } from "./vouchers/use-date-format";
import { Voucher } from "@/types/voucher";

export const useVouchers = () => {
  const { vouchers, setVouchers, loading, error, fetchVouchers } = useVouchersData();
  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    isEditing, 
    currentVoucher, 
    formData, 
    handleInputChange, 
    handleSelectChange, 
    resetForm, 
    openEditDialog 
  } = useVouchersForm();
  
  const { 
    createVoucher, 
    updateVoucher, 
    deleteVoucher, 
    handleDeleteVoucher 
  } = useVouchersCrud(setVouchers);
  
  const { formatDate } = useDateFormat();

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentVoucher) {
        await updateVoucher(currentVoucher.id, formData);
      } else {
        await createVoucher(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar voucher:", error);
    }
  };

  return {
    vouchers,
    loading,
    error,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    currentVoucher,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateVoucher,
    handleDeleteVoucher,
    formatDate,
    createVoucher,
    updateVoucher,
    deleteVoucher
  };
};
