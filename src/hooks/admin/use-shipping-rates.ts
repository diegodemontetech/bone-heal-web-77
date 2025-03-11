
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShippingRate } from "@/types/shipping";
import { toast } from "sonner";

export const useShippingRates = () => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRate, setCurrentRate] = useState<ShippingRate | null>(null);
  const [formData, setFormData] = useState({
    region: "",
    zip_code_start: "",
    zip_code_end: "",
    flat_rate: "",
    additional_kg_rate: "",
    estimated_days: "",
    is_active: true
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("region", { ascending: true })
        .order("zip_code_start", { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error("Erro ao buscar taxas de envio:", error);
      toast.error("Erro ao carregar taxas de envio");
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      region: "",
      zip_code_start: "",
      zip_code_end: "",
      flat_rate: "",
      additional_kg_rate: "",
      estimated_days: "",
      is_active: true
    });
    setIsEditing(false);
    setCurrentRate(null);
  };

  const openEditDialog = (rate: ShippingRate) => {
    setCurrentRate(rate);
    setFormData({
      region: rate.region,
      zip_code_start: rate.zip_code_start,
      zip_code_end: rate.zip_code_end,
      flat_rate: rate.flat_rate.toString(),
      additional_kg_rate: rate.additional_kg_rate.toString(),
      estimated_days: rate.estimated_days.toString(),
      is_active: rate.is_active
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreateRate = async () => {
    try {
      if (!formData.region || !formData.zip_code_start || !formData.zip_code_end || !formData.flat_rate) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      const rateData = {
        region: formData.region,
        zip_code_start: formData.zip_code_start,
        zip_code_end: formData.zip_code_end,
        flat_rate: Number(formData.flat_rate),
        additional_kg_rate: Number(formData.additional_kg_rate) || 0,
        estimated_days: Number(formData.estimated_days) || 5,
        is_active: formData.is_active
      };

      if (isEditing && currentRate) {
        // Atualizar taxa existente
        const { error } = await supabase
          .from("shipping_rates")
          .update(rateData)
          .eq("id", currentRate.id);

        if (error) throw error;
        toast.success("Taxa de envio atualizada com sucesso!");
      } else {
        // Criar nova taxa
        const { error } = await supabase
          .from("shipping_rates")
          .insert([rateData]);

        if (error) throw error;
        toast.success("Taxa de envio criada com sucesso!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRates();
    } catch (error: any) {
      console.error("Erro ao salvar taxa de envio:", error);
      toast.error(`Erro ao salvar taxa de envio: ${error.message}`);
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta taxa de envio?")) return;

    try {
      const { error } = await supabase
        .from("shipping_rates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Taxa de envio excluída com sucesso!");
      fetchRates();
    } catch (error: any) {
      console.error("Erro ao excluir taxa de envio:", error);
      toast.error(`Erro ao excluir taxa de envio: ${error.message}`);
    }
  };

  const exportRates = () => {
    try {
      const dataStr = JSON.stringify(rates, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'shipping-rates.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success("Taxas de envio exportadas com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar taxas:", error);
      toast.error("Erro ao exportar taxas de envio");
    }
  };

  return {
    rates,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateRate,
    handleDeleteRate,
    exportRates
  };
};
