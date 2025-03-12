
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

// Estenda a interface Voucher para adicionar a propriedade is_active
interface ExtendedVoucher {
  id: string;
  code: string;
  discount_type: string;
  discount_amount: number;
  min_amount: number;
  min_items: number;
  payment_method: string;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<ExtendedVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState<ExtendedVoucher | null>(null);
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
        is_active: voucher.is_active !== undefined ? voucher.is_active : true
      })) as ExtendedVoucher[];
      
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

      setVouchers(prev => [data as ExtendedVoucher, ...prev]);
      toast.success("Voucher criado com sucesso!");
      return data;
    } catch (err) {
      console.error("Erro ao criar voucher:", err);
      toast.error("Erro ao criar voucher");
      throw err;
    }
  };

  const updateVoucher = async (id: string, updates: Partial<ExtendedVoucher>) => {
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
          voucher.id === id ? data as ExtendedVoucher : voucher
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

  const openEditDialog = (voucher: ExtendedVoucher) => {
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
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else if (type === "number") {
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    },
    handleSelectChange: (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    resetForm,
    openEditDialog,
    handleCreateVoucher: async (e: React.FormEvent) => {
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
    },
    handleDeleteVoucher: async (id: string) => {
      if (window.confirm("Tem certeza que deseja excluir este voucher?")) {
        await deleteVoucher(id);
      }
    },
    formatDate: (dateString: string) => {
      try {
        return format(new Date(dateString), "dd/MM/yyyy");
      } catch (error) {
        return "Data inválida";
      }
    },
    createVoucher: async (voucher: VoucherFormData) => {
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

        setVouchers(prev => [data as ExtendedVoucher, ...prev]);
        toast.success("Voucher criado com sucesso!");
        return data;
      } catch (err) {
        console.error("Erro ao criar voucher:", err);
        toast.error("Erro ao criar voucher");
        throw err;
      }
    },
    updateVoucher: async (id: string, updates: Partial<ExtendedVoucher>) => {
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
            voucher.id === id ? data as ExtendedVoucher : voucher
          )
        );

        toast.success("Voucher atualizado com sucesso!");
        return data;
      } catch (err) {
        console.error("Erro ao atualizar voucher:", err);
        toast.error("Erro ao atualizar voucher");
        throw err;
      }
    },
    deleteVoucher: async (id: string) => {
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
    }
  };
};
