
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoucherFormData, Voucher } from "@/types/voucher";

export const useVouchersCrud = (setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>) => {
  const createVoucher = async (voucher: VoucherFormData) => {
    try {
      const newVoucher = {
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_amount: voucher.discount_amount,
        min_amount: voucher.min_amount,
        min_items: voucher.min_items,
        payment_method: voucher.payment_method,
        valid_from: voucher.valid_from,
        valid_until: voucher.valid_until,
        max_uses: voucher.max_uses,
        current_uses: 0,
        is_active: voucher.is_active
      };

      const { data, error } = await supabase
        .from("vouchers")
        .insert([newVoucher])
        .select()
        .single();

      if (error) throw error;

      setVouchers(prev => [data as Voucher, ...prev]);
      toast.success("Voucher criado com sucesso!");
      return data;
    } catch (err) {
      console.error("Erro ao criar voucher:", err);
      toast.error("Erro ao criar voucher");
      throw err;
    }
  };

  const updateVoucher = async (id: string, updates: Partial<Voucher>) => {
    try {
      const { data, error } = await supabase
        .from("vouchers")
        .update({
          code: updates.code,
          discount_type: updates.discount_type,
          discount_amount: updates.discount_amount,
          min_amount: updates.min_amount,
          min_items: updates.min_items,
          payment_method: updates.payment_method,
          valid_from: updates.valid_from,
          valid_until: updates.valid_until,
          max_uses: updates.max_uses,
          is_active: updates.is_active
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setVouchers(prev => 
        prev.map(voucher => 
          voucher.id === id ? data as Voucher : voucher
        )
      );

      toast.success("Voucher atualizado com sucesso!");
      return data;
    } catch (err) {
      console.error("Erro ao atualizar voucher:", err);
      toast.error("Erro ao atualizar voucher");
      throw err;
    }
  };

  const deleteVoucher = async (id: string) => {
    try {
      const { error } = await supabase
        .from("vouchers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setVouchers(prev => prev.filter(voucher => voucher.id !== id));
      toast.success("Voucher excluído com sucesso!");
      return true;
    } catch (err) {
      console.error("Erro ao excluir voucher:", err);
      toast.error("Erro ao excluir voucher");
      return false;
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este voucher?")) {
      await deleteVoucher(id);
    }
  };

  return {
    createVoucher,
    updateVoucher,
    deleteVoucher,
    handleDeleteVoucher
  };
};
