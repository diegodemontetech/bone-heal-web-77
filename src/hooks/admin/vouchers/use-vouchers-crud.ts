
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoucherFormData, Voucher } from "@/types/voucher";

export const useVouchersCrud = (setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>) => {
  const createVoucher = async (voucher: VoucherFormData) => {
    try {
      // Converter explicitamente as datas para string
      const validFrom = typeof voucher.valid_from === 'string' 
        ? voucher.valid_from 
        : voucher.valid_from instanceof Date
          ? voucher.valid_from.toISOString()
          : new Date().toISOString();
      
      const validUntil = typeof voucher.valid_until === 'string' 
        ? voucher.valid_until 
        : voucher.valid_until instanceof Date
          ? voucher.valid_until.toISOString()
          : null;

      const newVoucher = {
        code: voucher.code,
        discount_type: voucher.discount_type,
        discount_amount: voucher.discount_amount,
        min_amount: voucher.min_amount || 0,
        min_items: voucher.min_items || 0,
        payment_method: voucher.payment_method === 'all' ? null : voucher.payment_method,
        valid_from: validFrom,
        valid_until: validUntil || null,
        max_uses: voucher.max_uses || null,
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

  const updateVoucher = async (id: string, updates: Partial<VoucherFormData>) => {
    try {
      // Converter explicitamente as datas para string
      const validFrom = updates.valid_from !== undefined 
        ? (typeof updates.valid_from === 'string' 
            ? updates.valid_from 
            : updates.valid_from instanceof Date
              ? updates.valid_from.toISOString()
              : null)
        : undefined;
      
      const validUntil = updates.valid_until !== undefined 
        ? (typeof updates.valid_until === 'string' 
            ? updates.valid_until 
            : updates.valid_until instanceof Date
              ? updates.valid_until.toISOString()
              : null)
        : undefined;

      const { data, error } = await supabase
        .from("vouchers")
        .update({
          code: updates.code,
          discount_type: updates.discount_type,
          discount_amount: updates.discount_amount,
          min_amount: updates.min_amount,
          min_items: updates.min_items,
          payment_method: updates.payment_method === 'all' ? null : updates.payment_method,
          valid_from: validFrom,
          valid_until: validUntil,
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
