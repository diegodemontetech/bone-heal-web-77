
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMField } from "@/types/crm";
import { FieldFormData } from "./types";

export const useFieldsConfig = (pipelineId: string) => {
  const [fields, setFields] = useState<CRMField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  const fetchFields = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_fields')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFields(data as CRMField[]);
    } catch (error) {
      console.error('Erro ao buscar campos:', error);
      toast.error('Erro ao carregar campos');
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
        options: Array.isArray(field.options) ? field.options.join(', ') : '',
        mask: field.mask || "",
        default_value: field.default_value || ""
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
        default_value: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentField(null);
  };

  const handleCreateField = async (data: FieldFormData) => {
    setIsSaving(true);
    try {
      // Processar opções se for um campo tipo select, radio ou checkbox
      const options = ["select", "radio", "checkbox"].includes(data.type) && data.options
        ? data.options.split(',').map(opt => opt.trim())
        : [];

      const newField = {
        name: data.name,
        label: data.label,
        type: data.type,
        required: data.required,
        display_in_kanban: data.display_in_kanban,
        options: options.length > 0 ? options : null,
        mask: data.mask || null,
        default_value: data.default_value || null,
        pipeline_id: pipelineId
      };

      const { data: createdField, error } = await supabase
        .from('crm_fields')
        .insert([newField])
        .select()
        .single();

      if (error) throw error;

      setFields([...fields, createdField as CRMField]);
      toast.success('Campo criado com sucesso!');
      handleCloseDialog();
    } catch (error: any) {
      console.error('Erro ao criar campo:', error);
      toast.error(`Erro ao criar campo: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateField = async (data: FieldFormData) => {
    if (!currentField) return;
    
    setIsSaving(true);
    try {
      // Processar opções se for um campo tipo select, radio ou checkbox
      const options = ["select", "radio", "checkbox"].includes(data.type) && data.options
        ? data.options.split(',').map(opt => opt.trim())
        : [];

      const updatedField = {
        name: data.name,
        label: data.label,
        type: data.type,
        required: data.required,
        display_in_kanban: data.display_in_kanban,
        options: options.length > 0 ? options : null,
        mask: data.mask || null,
        default_value: data.default_value || null
      };

      const { error } = await supabase
        .from('crm_fields')
        .update(updatedField)
        .eq('id', currentField.id);

      if (error) throw error;

      setFields(fields.map(field => 
        field.id === currentField.id 
          ? { ...field, ...updatedField }
          : field
      ));
      
      toast.success('Campo atualizado com sucesso!');
      handleCloseDialog();
    } catch (error: any) {
      console.error('Erro ao atualizar campo:', error);
      toast.error(`Erro ao atualizar campo: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('crm_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      setFields(fields.filter(field => field.id !== fieldId));
      toast.success('Campo excluído com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir campo:', error);
      toast.error(`Erro ao excluir campo: ${error.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentField) {
      handleUpdateField(formData);
    } else {
      handleCreateField(formData);
    }
  };

  const getDefaultMask = (type: string) => {
    switch (type) {
      case "phone":
        return "(99) 99999-9999";
      case "cpf":
        return "999.999.999-99";
      case "cnpj":
        return "99.999.999/9999-99";
      case "date":
        return "99/99/9999";
      case "cep":
        return "99999-999";
      default:
        return "";
    }
  };

  return {
    fields,
    loading,
    isDialogOpen,
    currentField,
    formData,
    isSaving,
    handleOpenDialog,
    handleCloseDialog,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleSubmit,
    handleDeleteField,
    getDefaultMask
  };
};
