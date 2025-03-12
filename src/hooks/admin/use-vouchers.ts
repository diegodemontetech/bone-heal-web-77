
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Voucher } from "@/types/voucher";
import { format } from "date-fns";

interface VoucherFormData {
  code: string;
  discount_type: string;
  discount_amount: number;
  min_amount?: number;
  min_items?: number;
  payment_method?: string;
  valid_from: string;
  valid_until?: string;
  max_uses?: number;
  is_active: boolean;
}

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
      
      // Garantir que todos os vouchers tenham o campo is_active
      const formattedVouchers = data.map(voucher => ({
        ...voucher,
        is_active: voucher.is_active ?? true
      })) as Voucher[];
      
      setVouchers(formattedVouchers);
    } catch (err) {
      console.error("Erro ao buscar vouchers:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Erro ao carregar vouchers");
    } finally {
      setLoading(false);
    }
  };

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

  const createVoucher = async (voucher: Partial<Voucher>) => {
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

      const voucherWithIsActive = {
        ...data,
        is_active: data.is_active ?? true
      } as Voucher;

      setVouchers(prev => [voucherWithIsActive, ...prev]);
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

      const voucherWithIsActive = {
        ...data,
        is_active: data.is_active ?? true
      } as Voucher;

      setVouchers(prev => 
        prev.map(voucher => 
          voucher.id === id ? voucherWithIsActive : voucher
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
      is_active: voucher.is_active
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentVoucher) {
        await updateVoucher(currentVoucher.id, formData as Partial<Voucher>);
      } else {
        await createVoucher(formData as Partial<Voucher>);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar voucher:", error);
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este voucher?")) {
      await deleteVoucher(id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Data inválida";
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
