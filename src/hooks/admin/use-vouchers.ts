import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Voucher {
  id: string;
  created_at: string;
  updated_at: string;
  code: string;
  discount_type: string;
  discount_amount: number;
  min_amount: number;
  min_items: number;
  max_uses: number;
  current_uses: number;
  valid_from: string;
  valid_until: string;
  payment_method: string;
  is_active: boolean;
}

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('vouchers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar vouchers:', error);
          setError(error);
          toast.error('Erro ao buscar vouchers.');
        }

        if (data) {
          setVouchers(data.map(voucher => ({
            ...voucher,
            is_active: true, // valor padrão para o campo ausente
          })));
        }
      } catch (err: any) {
        console.error('Erro inesperado ao buscar vouchers:', err);
        setError(err);
        toast.error('Erro inesperado ao buscar vouchers.');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const createVoucher = async (voucher: Omit<Voucher, 'id' | 'created_at' | 'updated_at' | 'current_uses' | 'is_active'>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('vouchers')
        .insert([
          {
            ...voucher,
            current_uses: 0,
          },
        ]);

      if (error) {
        console.error('Erro ao criar voucher:', error);
        toast.error('Erro ao criar voucher.');
      } else {
        toast.success('Voucher criado com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao criar voucher:', err);
      toast.error(`Erro ao criar voucher: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateVoucher = async (id: string, updates: Partial<Voucher>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('vouchers')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar voucher:', error);
        toast.error('Erro ao atualizar voucher.');
      } else {
        toast.success('Voucher atualizado com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao atualizar voucher:', err);
      toast.error(`Erro ao atualizar voucher: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteVoucher = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir voucher:', error);
        toast.error('Erro ao excluir voucher.');
      } else {
        toast.success('Voucher excluído com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao excluir voucher:', err);
      toast.error(`Erro ao excluir voucher: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    vouchers,
    loading,
    error,
    createVoucher,
    updateVoucher,
    deleteVoucher,
  };
};
