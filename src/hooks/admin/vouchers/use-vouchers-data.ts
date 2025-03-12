
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Voucher } from "@/types/voucher";

export const useVouchersData = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const formattedVouchers = data.map(voucher => {
        // Garantir que todos os vouchers tenham a propriedade is_active com valor padrão true
        return {
          ...voucher,
          discount_type: voucher.discount_type as 'percentage' | 'fixed' | 'shipping',
          is_active: voucher.is_active !== undefined ? Boolean(voucher.is_active) : true
        } as Voucher;
      });
      
      setVouchers(formattedVouchers);
    } catch (err) {
      console.error("Erro ao buscar vouchers:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Erro ao carregar vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return {
    vouchers,
    setVouchers,
    loading,
    error,
    fetchVouchers
  };
};
