
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
        // Converter as datas para string
        const updatedData = {
          ...formData,
          valid_from: typeof formData.valid_from === 'string' 
            ? formData.valid_from 
            : formData.valid_from instanceof Date 
              ? formData.valid_from.toISOString() 
              : formData.valid_from,
          valid_until: typeof formData.valid_until === 'string' 
            ? formData.valid_until 
            : formData.valid_until instanceof Date 
              ? formData.valid_until.toISOString() 
              : formData.valid_until
        };
        await updateVoucher(currentVoucher.id, updatedData);
      } else {
        // Converter as datas para string
        const newData = {
          ...formData,
          valid_from: typeof formData.valid_from === 'string' 
            ? formData.valid_from 
            : formData.valid_from instanceof Date 
              ? formData.valid_from.toISOString() 
              : formData.valid_from,
          valid_until: typeof formData.valid_until === 'string' 
            ? formData.valid_until 
            : formData.valid_until instanceof Date 
              ? formData.valid_until.toISOString() 
              : formData.valid_until
        };
        await createVoucher(newData);
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
