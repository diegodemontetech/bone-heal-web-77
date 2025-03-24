
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommercialCondition, CommercialConditionFormData } from "@/types/commercial-conditions";

interface UseCommercialConditionFormProps {
  onSuccess: () => void;
  existingCondition?: CommercialCondition | null;
}

export const useCommercialConditionForm = ({ onSuccess, existingCondition }: UseCommercialConditionFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CommercialConditionFormData>({
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    is_active: true,
    valid_from: "",
    valid_until: "",
    min_amount: "",
    min_items: "",
    payment_method: "all", // Changed from empty string to "all"
    region: "all", // Changed from empty string to "all"
    customer_group: "all", // Changed from empty string to "all"
    product_id: "",
    product_category: "all", // Changed from empty string to "all"
    free_shipping: false,
    is_cumulative: true
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
        valid_from: existingCondition.valid_from || "",
        valid_until: existingCondition.valid_until || "",
        min_amount: existingCondition.min_amount ? existingCondition.min_amount.toString() : "",
        min_items: existingCondition.min_items ? existingCondition.min_items.toString() : "",
        payment_method: existingCondition.payment_method || "all", // Changed from empty string to "all"
        region: existingCondition.region || "all", // Changed from empty string to "all"
        customer_group: existingCondition.customer_group || "all", // Changed from empty string to "all"
        product_id: existingCondition.product_id || "",
        product_category: existingCondition.product_category || "all", // Changed from empty string to "all"
        free_shipping: existingCondition.free_shipping || false,
        is_cumulative: existingCondition.is_cumulative !== undefined ? existingCondition.is_cumulative : true
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
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        min_items: formData.min_items ? parseInt(formData.min_items, 10) : null,
        payment_method: formData.payment_method === "all" ? null : formData.payment_method, // Handle "all" value
        region: formData.region === "all" ? null : formData.region, // Handle "all" value
        customer_group: formData.customer_group === "all" ? null : formData.customer_group, // Handle "all" value
        product_id: formData.product_id || null,
        product_category: formData.product_category === "all" ? null : formData.product_category, // Handle "all" value
        free_shipping: formData.free_shipping,
        is_cumulative: formData.is_cumulative
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
