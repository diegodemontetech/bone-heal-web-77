
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShippingRateFormData } from "./types";

export const useShippingRatesCrud = () => {
  const [formData, setFormData] = useState<Partial<ShippingRateFormData> & { id?: string }>({
    region: "",
    state: "",
    zip_code_start: "",
    zip_code_end: "",
    flat_rate: 0,
    rate: 0,
    additional_kg_rate: 0,
    estimated_days: 3,
    is_active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      region: "",
      state: "",
      zip_code_start: "",
      zip_code_end: "",
      flat_rate: 0,
      rate: 0,
      additional_kg_rate: 0,
      estimated_days: 3,
      is_active: true
    });
    setIsEditing(false);
  };

  const openEditDialog = (rate: any) => {
    setFormData({
      ...rate,
      id: rate.id
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.region || !formData.state || !formData.zip_code_start || !formData.zip_code_end) {
      toast.error("Preencha todos os campos obrigatórios");
      return false;
    }

    try {
      if (isEditing && formData.id) {
        // Atualizar
        const { error } = await supabase
          .from("shipping_rates")
          .update({
            region: formData.region,
            state: formData.state,
            zip_code_start: formData.zip_code_start,
            zip_code_end: formData.zip_code_end,
            flat_rate: formData.flat_rate || 0,
            rate: formData.rate || 0,
            additional_kg_rate: formData.additional_kg_rate || 0,
            estimated_days: formData.estimated_days || 3,
            is_active: formData.is_active === undefined ? true : formData.is_active
          })
          .eq("id", formData.id);

        if (error) throw error;
        toast.success("Taxa de envio atualizada com sucesso");
      } else {
        // Criar
        const { error } = await supabase
          .from("shipping_rates")
          .insert([{
            region: formData.region,
            state: formData.state || formData.region,
            zip_code_start: formData.zip_code_start,
            zip_code_end: formData.zip_code_end,
            flat_rate: formData.flat_rate || 0,
            rate: formData.rate || 0,
            additional_kg_rate: formData.additional_kg_rate || 0,
            estimated_days: formData.estimated_days || 3,
            is_active: formData.is_active === undefined ? true : formData.is_active
          }]);

        if (error) throw error;
        toast.success("Taxa de envio criada com sucesso");
      }

      // Fechar diálogo
      setIsDialogOpen(false);
      resetForm();
      return true;
    } catch (err) {
      console.error("Erro ao salvar taxa de envio:", err);
      toast.error("Erro ao salvar taxa de envio");
      return false;
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta taxa de envio?")) {
      return false;
    }

    try {
      const { error } = await supabase
        .from("shipping_rates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Taxa de envio excluída com sucesso");
      return true;
    } catch (err) {
      console.error("Erro ao excluir taxa de envio:", err);
      toast.error("Erro ao excluir taxa de envio");
      return false;
    }
  };

  return {
    formData,
    isEditing,
    isDialogOpen,
    setIsDialogOpen,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateRate,
    handleDeleteRate
  };
};
