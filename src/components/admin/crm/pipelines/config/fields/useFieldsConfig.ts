
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMField } from "@/types/crm";
import { FieldFormData } from "./types";

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
    default_value: ""
  });

  useEffect(() => {
    fetchFields();
  }, [pipelineId]);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_fields")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("created_at");

      if (error) throw error;
      setFields(data || []);
    } catch (err) {
      console.error("Erro ao buscar campos:", err);
      toast.error("Erro ao carregar campos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      label: "",
      type: "text",
      required: false,
      display_in_kanban: false,
      options: "",
      mask: "",
      default_value: ""
    });
    setCurrentField(null);
  };

  const handleOpenDialog = (field?: CRMField) => {
    if (field) {
      setCurrentField(field);
      setFormData({
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        display_in_kanban: field.display_in_kanban,
        options: field.options ? field.options.join(", ") : "",
        mask: field.mask || "",
        default_value: field.default_value || ""
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 300); // Reset after animation completes
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este campo?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("crm_fields")
        .delete()
        .eq("id", fieldId);

      if (error) throw error;

      setFields(fields.filter(field => field.id !== fieldId));
      toast.success("Campo excluído com sucesso");
    } catch (err) {
      console.error("Erro ao excluir campo:", err);
      toast.error("Erro ao excluir campo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validação básica
      if (!formData.name.trim() || !formData.label.trim()) {
        toast.error("Nome e rótulo são obrigatórios");
        return;
      }

      // Formatar as opções para array quando necessário
      let processedOptions = null;
      if (["select", "radio", "checkbox"].includes(formData.type) && formData.options) {
        processedOptions = formData.options.split(",").map(option => option.trim());
      }

      const fieldData = {
        name: formData.name,
        label: formData.label,
        type: formData.type,
        required: formData.required,
        display_in_kanban: formData.display_in_kanban,
        options: processedOptions,
        mask: formData.mask || null,
        default_value: formData.default_value || null,
        pipeline_id: pipelineId
      };

      if (currentField) {
        // Atualizar campo existente
        const { error } = await supabase
          .from("crm_fields")
          .update(fieldData)
          .eq("id", currentField.id);

        if (error) throw error;
        
        setFields(fields.map(field => 
          field.id === currentField.id ? { ...field, ...fieldData } : field
        ));
        
        toast.success("Campo atualizado com sucesso");
      } else {
        // Criar novo campo
        const { data, error } = await supabase
          .from("crm_fields")
          .insert(fieldData)
          .select()
          .single();

        if (error) throw error;
        
        setFields([...fields, data]);
        toast.success("Campo criado com sucesso");
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Erro ao salvar campo:", err);
      toast.error("Erro ao salvar campo");
    }
  };

  const getDefaultMask = (type: string) => {
    switch (type) {
      case "phone": return "(99) 99999-9999";
      case "cpf": return "999.999.999-99";
      case "cnpj": return "99.999.999/9999-99";
      case "cep": return "99999-999";
      case "money": return "R$ #.##0,00";
      default: return "";
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
    handleSwitchChange,
    handleSelectChange,
    handleDeleteField,
    handleSubmit,
    getDefaultMask
  };
};
