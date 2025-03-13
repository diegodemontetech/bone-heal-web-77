
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMField } from "@/types/crm";
import { FieldFormData } from "./types";

// Função para converter o objeto FieldFormData para CRMField
const convertFormDataToField = (formData: FieldFormData, pipelineId: string, fieldId?: string): Partial<CRMField> => {
  return {
    id: fieldId,
    pipeline_id: pipelineId,
    name: formData.name,
    label: formData.label,
    type: formData.type,
    required: formData.required,
    display_in_kanban: formData.display_in_kanban,
    options: formData.options ? JSON.parse(formData.options) : null,
    mask: formData.mask || null,
    default_value: formData.default_value || null,
  };
};

export const useFieldsConfig = (pipelineId: string) => {
  const [fields, setFields] = useState<CRMField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<CRMField | null>(null);
  const [formData, setFormData] = useState<FieldFormData>({
    name: "",
    label: "",
    type: "text",
    required: false,
    display_in_kanban: false,
    options: "",
    mask: "",
    default_value: "",
  });

  // Carrega os campos do pipeline
  const fetchFields = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_fields")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setFields(data as CRMField[]);
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
      toast.error("Erro ao carregar campos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pipelineId) {
      fetchFields();
    }
  }, [pipelineId]);

  const handleOpenDialog = (field?: CRMField) => {
    if (field) {
      setCurrentField(field);
      setFormData({
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        display_in_kanban: field.display_in_kanban,
        options: field.options ? JSON.stringify(field.options) : "",
        mask: field.mask || "",
        default_value: field.default_value || "",
      });
    } else {
      setCurrentField(null);
      setFormData({
        name: "",
        label: "",
        type: "text",
        required: false,
        display_in_kanban: false,
        options: "",
        mask: "",
        default_value: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const getDefaultMask = (type: string): string => {
    switch (type) {
      case "phone":
        return "(99) 99999-9999";
      case "date":
        return "99/99/9999";
      case "cpf":
        return "999.999.999-99";
      case "cnpj":
        return "99.999.999/9999-99";
      case "cep":
        return "99999-999";
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fieldData = convertFormDataToField(formData, pipelineId, currentField?.id);

      let response;
      if (currentField) {
        response = await supabase
          .from("crm_fields")
          .update(fieldData)
          .eq("id", currentField.id);
      } else {
        response = await supabase
          .from("crm_fields")
          .insert([fieldData]);
      }

      if (response.error) throw response.error;

      toast.success(`Campo ${currentField ? "atualizado" : "criado"} com sucesso!`);
      handleCloseDialog();
      fetchFields();
    } catch (error: any) {
      console.error("Erro ao salvar campo:", error);
      toast.error(`Erro ao salvar campo: ${error.message}`);
    }
  };

  const deleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from("crm_fields")
        .delete()
        .eq("id", fieldId);

      if (error) throw error;

      toast.success("Campo excluído com sucesso!");
      fetchFields();
    } catch (error: any) {
      console.error("Erro ao excluir campo:", error);
      toast.error(`Erro ao excluir campo: ${error.message}`);
    }
  };

  return {
    fields,
    loading,
    isDialogOpen,
    currentField,
    formData,
    handleOpenDialog,
    handleCloseDialog,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleSubmit,
    deleteField,
    getDefaultMask,
  };
};
