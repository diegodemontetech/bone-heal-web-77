
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShippingRate } from "@/types/shipping";
import { toast } from "sonner";
import Papa from "papaparse";

export const useShippingRates = () => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    region: '',
    zip_code_start: '',
    zip_code_end: '',
    flat_rate: '',
    additional_kg_rate: '',
    estimated_days: '',
    is_active: true,
  });

  const fetchRates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipping_rates')
        .select('*')
        .order('region', { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar taxas de envio:", error);
      toast.error(`Erro ao buscar taxas de envio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      region: '',
      zip_code_start: '',
      zip_code_end: '',
      flat_rate: '',
      additional_kg_rate: '',
      estimated_days: '',
      is_active: true,
    });
    setIsEditing(false);
  };

  const openEditDialog = (rate: ShippingRate) => {
    setIsEditing(true);
    setFormData({
      region: rate.region || '',
      zip_code_start: rate.zip_code_start || '',
      zip_code_end: rate.zip_code_end || '',
      flat_rate: rate.flat_rate?.toString() || '',
      additional_kg_rate: rate.additional_kg_rate?.toString() || '',
      estimated_days: rate.estimated_days?.toString() || '',
      is_active: rate.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleCreateRate = async () => {
    try {
      const rateData = {
        region: formData.region,
        zip_code_start: formData.zip_code_start.replace(/\D/g, ''),
        zip_code_end: formData.zip_code_end.replace(/\D/g, ''),
        flat_rate: parseFloat(formData.flat_rate),
        additional_kg_rate: parseFloat(formData.additional_kg_rate),
        estimated_days: parseInt(formData.estimated_days),
        is_active: formData.is_active
      };

      // Validações
      if (!rateData.region) {
        toast.error("Por favor, selecione uma região");
        return;
      }

      if (!rateData.zip_code_start || !rateData.zip_code_end) {
        toast.error("Por favor, informe os CEPs inicial e final");
        return;
      }

      if (isNaN(rateData.flat_rate) || rateData.flat_rate <= 0) {
        toast.error("Por favor, informe uma taxa base válida");
        return;
      }

      if (isNaN(rateData.estimated_days) || rateData.estimated_days <= 0) {
        toast.error("Por favor, informe um prazo estimado válido");
        return;
      }

      let response;
      if (isEditing) {
        // Buscar o ID da taxa sendo editada
        const editingRate = rates.find(r => 
          r.region === formData.region && 
          r.zip_code_start === formData.zip_code_start.replace(/\D/g, '') && 
          r.zip_code_end === formData.zip_code_end.replace(/\D/g, '')
        );

        if (!editingRate?.id) {
          toast.error("Erro ao identificar a taxa para atualização");
          return;
        }

        response = await supabase
          .from('shipping_rates')
          .update(rateData)
          .eq('id', editingRate.id);
      } else {
        response = await supabase
          .from('shipping_rates')
          .insert([rateData]);
      }

      if (response.error) throw response.error;

      toast.success(isEditing ? "Taxa atualizada com sucesso!" : "Taxa criada com sucesso!");
      setIsDialogOpen(false);
      resetForm();
      fetchRates();
    } catch (error: any) {
      console.error("Erro ao salvar taxa:", error);
      toast.error(`Erro ao salvar taxa: ${error.message}`);
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta taxa de envio?")) return;
    
    try {
      const { error } = await supabase
        .from('shipping_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Taxa excluída com sucesso!");
      fetchRates();
    } catch (error: any) {
      console.error("Erro ao excluir taxa:", error);
      toast.error(`Erro ao excluir taxa: ${error.message}`);
    }
  };
  
  const exportRates = () => {
    try {
      const exportData = rates.map(rate => ({
        Região: rate.region,
        'CEP Inicial': rate.zip_code_start,
        'CEP Final': rate.zip_code_end,
        'Taxa Base (R$)': rate.flat_rate,
        'Taxa por Kg Adicional (R$)': rate.additional_kg_rate,
        'Prazo Estimado (dias)': rate.estimated_days,
        'Ativo': rate.is_active ? 'Sim' : 'Não'
      }));

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'taxas_de_envio.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Erro ao exportar taxas:', error);
      toast.error(`Erro ao exportar taxas: ${error.message}`);
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
