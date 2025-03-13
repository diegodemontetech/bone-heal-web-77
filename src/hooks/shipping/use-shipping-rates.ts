import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShippingCalculationRate } from "@/types/shipping";

interface ShippingRate {
  id?: string;
  region: string;
  state: string;
  zip_code_start: string;
  zip_code_end: string;
  flat_rate: number;
  rate: number;
  additional_kg_rate: number;
  estimated_days: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useShippingRates = () => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ShippingRate>>({
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
  const [shippingOptions, setShippingOptions] = useState<ShippingCalculationRate[]>([]);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("region", { ascending: true });

      if (error) throw error;
      setRates(data);
    } catch (err) {
      console.error("Erro ao buscar taxas de envio:", err);
      toast.error("Erro ao carregar taxas de envio");
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

  const openEditDialog = (rate: ShippingRate) => {
    setFormData(rate);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.region || !formData.state || !formData.zip_code_start || !formData.zip_code_end) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
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
            state: formData.state,
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

      // Recarregar dados e fechar diálogo
      await fetchRates();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar taxa de envio:", err);
      toast.error("Erro ao salvar taxa de envio");
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta taxa de envio?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("shipping_rates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setRates(prev => prev.filter(rate => rate.id !== id));
      toast.success("Taxa de envio excluída com sucesso");
    } catch (err) {
      console.error("Erro ao excluir taxa de envio:", err);
      toast.error("Erro ao excluir taxa de envio");
    }
  };

  const calculateShipping = async (zipCode: string, serviceType: string) => {
    // ... keep existing code (função para calcular frete)
  };

  const getShippingByZipCode = async (zipCode: string) => {
    setLoading(true);
    setShippingOptions([]);
    try {
      const options: ShippingCalculationRate[] = [];

      // Ao criar ShippingCalculationRate em getShippingByZipCode
      const sedexResponse = await calculateShipping(zipCode, "SEDEX");
      if (sedexResponse) {
        options.push({
          id: 'sedex-' + zipCode, // Adicionando ID único
          name: "SEDEX",
          service_type: "SEDEX",
          rate: sedexResponse.totalPrice,
          price: sedexResponse.totalPrice, // Adicionando price para corresponder à interface
          delivery_days: sedexResponse.estimatedDays,
          zipCode
        });
      }

      const pacResponse = await calculateShipping(zipCode, "PAC");
      if (pacResponse) {
        options.push({
          id: 'pac-' + zipCode, // Adicionando ID único
          name: "PAC",
          service_type: "PAC",
          rate: pacResponse.totalPrice,
          price: pacResponse.totalPrice, // Adicionando price para corresponder à interface
          delivery_days: pacResponse.estimatedDays,
          zipCode
        });
      }

      setShippingOptions(options);
    } catch (error) {
      console.error("Erro ao obter opções de frete:", error);
      toast.error("Erro ao obter opções de frete");
    } finally {
      setLoading(false);
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
    getShippingByZipCode,
    shippingOptions
  };
};
