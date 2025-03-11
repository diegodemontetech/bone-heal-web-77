
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommercialCondition {
  id: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  payment_method: string | null;
  min_amount: number | null;
  min_items: number | null;
  valid_until: string | null;
  region: string | null;
  customer_group: string | null;
  free_shipping: boolean;
}

interface UseCommercialConditionFormProps {
  onSuccess: () => void;
  existingCondition?: CommercialCondition | null;
}

export const useCommercialConditionForm = ({ onSuccess, existingCondition }: UseCommercialConditionFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    is_active: true,
    valid_until: "",
    min_amount: "",
    min_items: "",
    payment_method: "",
    region: "",
    customer_group: "",
    free_shipping: false
  });

  // Carregar dados existentes se estiver no modo de edição
  useEffect(() => {
    if (existingCondition) {
      setFormData({
        name: existingCondition.name,
        description: existingCondition.description || "",
        discount_type: existingCondition.discount_type,
        discount_value: existingCondition.discount_value,
        is_active: existingCondition.is_active,
        valid_until: existingCondition.valid_until || "",
        min_amount: existingCondition.min_amount ? existingCondition.min_amount.toString() : "",
        min_items: existingCondition.min_items ? existingCondition.min_items.toString() : "",
        payment_method: existingCondition.payment_method || "",
        region: existingCondition.region || "",
        customer_group: existingCondition.customer_group || "",
        free_shipping: existingCondition.free_shipping || false
      });
    }
  }, [existingCondition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error("O nome da condição comercial é obrigatório");
      }

      if (!formData.discount_value && formData.discount_type !== "shipping") {
        throw new Error("O valor do desconto é obrigatório");
      }

      // Preparando os dados para envio
      const preparedData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_type === "shipping" ? 0 : parseFloat(formData.discount_value.toString()),
        is_active: formData.is_active,
        valid_until: formData.valid_until || null,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        min_items: formData.min_items ? parseInt(formData.min_items, 10) : null,
        payment_method: formData.payment_method || null,
        region: formData.region || null,
        customer_group: formData.customer_group || null,
        free_shipping: formData.free_shipping
      };

      console.log("Dados a serem enviados:", preparedData);

      let result;
      if (existingCondition) {
        // Modo de edição - atualizar registro existente
        result = await supabase
          .from('commercial_conditions')
          .update(preparedData)
          .eq('id', existingCondition.id);
      } else {
        // Modo de criação - inserir novo registro
        result = await supabase
          .from('commercial_conditions')
          .insert([preparedData]);
      }

      const { error } = result;

      if (error) {
        console.error("Erro na operação:", error);
        throw new Error(error.message);
      }

      toast.success(existingCondition 
        ? "Condição comercial atualizada com sucesso!" 
        : "Condição comercial criada com sucesso!"
      );
      onSuccess();
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(`Erro: ${error.message || "Verifique os dados e tente novamente."}`);
    } finally {
      setLoading(false);
    }
  };

  // Funções para manipular mudanças dos campos
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    loading,
    handleSubmit,
    updateField,
  };
};
