
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Voucher } from "@/types/voucher";
import { toast } from "sonner";

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_percentage: 0,
    discount_amount: "",
    max_uses: "",
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: "",
    minimum_purchase: "",
    is_active: true
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
      toast.error("Erro ao carregar cupons de desconto");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_percentage: 0,
      discount_amount: "",
      max_uses: "",
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: "",
      minimum_purchase: "",
      is_active: true
    });
    setIsEditing(false);
    setCurrentVoucher(null);
  };

  const openEditDialog = (voucher: Voucher) => {
    setCurrentVoucher(voucher);
    setFormData({
      code: voucher.code,
      discount_percentage: voucher.discount_percentage,
      discount_amount: voucher.discount_amount?.toString() || "",
      max_uses: voucher.max_uses?.toString() || "",
      valid_from: new Date(voucher.valid_from).toISOString().split('T')[0],
      valid_until: voucher.valid_until ? new Date(voucher.valid_until).toISOString().split('T')[0] : "",
      minimum_purchase: voucher.minimum_purchase?.toString() || "",
      is_active: voucher.is_active
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreateVoucher = async () => {
    try {
      if (!formData.code || (!formData.discount_percentage && !formData.discount_amount)) {
        toast.error("Por favor, preencha pelo menos o código e um tipo de desconto");
        return;
      }

      const voucherData = {
        code: formData.code,
        discount_percentage: Number(formData.discount_percentage),
        discount_amount: formData.discount_amount ? Number(formData.discount_amount) : null,
        max_uses: formData.max_uses ? Number(formData.max_uses) : null,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        minimum_purchase: formData.minimum_purchase ? Number(formData.minimum_purchase) : null,
        is_active: formData.is_active
      };

      if (isEditing && currentVoucher) {
        // Atualizar cupom existente
        const { error } = await supabase
          .from("vouchers")
          .update(voucherData)
          .eq("id", currentVoucher.id);

        if (error) throw error;
        toast.success("Cupom atualizado com sucesso!");
      } else {
        // Criar novo cupom
        const { error } = await supabase
          .from("vouchers")
          .insert([voucherData]);

        if (error) throw error;
        toast.success("Cupom criado com sucesso!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchVouchers();
    } catch (error: any) {
      console.error("Erro ao salvar cupom:", error);
      toast.error(`Erro ao salvar cupom: ${error.message}`);
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

    try {
      const { error } = await supabase
        .from("vouchers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Cupom excluído com sucesso!");
      fetchVouchers();
    } catch (error: any) {
      console.error("Erro ao excluir cupom:", error);
      toast.error(`Erro ao excluir cupom: ${error.message}`);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return {
    vouchers,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    currentVoucher,
    formData,
    handleInputChange,
    resetForm,
    openEditDialog,
    handleCreateVoucher,
    handleDeleteVoucher,
    formatDate
  };
};
