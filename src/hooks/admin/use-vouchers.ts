import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Voucher {
  id: string;
  code: string;
  discount_type: string;
  discount_amount: number;
  min_amount?: number;
  min_items?: number;
  payment_method?: string;
  valid_from: string;
  valid_until?: string;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setVouchers(data.map(voucher => ({
        ...voucher,
        is_active: voucher.is_active ?? true // Garantir que todos os vouchers tenham is_active
      })));
    } catch (err) {
      console.error("Erro ao buscar vouchers:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Erro ao carregar vouchers");
    } finally {
      setLoading(false);
    }
  };

  const createVoucher = async (voucher: Omit<Voucher, "id" | "created_at" | "updated_at" | "current_uses" | "is_active">) => {
    try {
      const newVoucher = {
        ...voucher,
        current_uses: 0,
        is_active: true
      };

      const { data, error } = await supabase
        .from("vouchers")
        .insert([newVoucher])
        .select()
        .single();

      if (error) throw error;

      setVouchers(prev => [data, ...prev]);
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
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setVouchers(prev => 
        prev.map(voucher => 
          voucher.id === id ? { ...voucher, ...data } : voucher
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

  return {
    vouchers,
    loading,
    error,
    createVoucher,
    updateVoucher,
    deleteVoucher
  };
};
