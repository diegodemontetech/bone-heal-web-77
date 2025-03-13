
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMField } from "@/types/crm";

export interface FieldFormData {
  name: string;
  label: string;
  type: string;
  required: boolean;
  display_in_kanban: boolean;
  options?: string[];
  mask?: string;
  default_value?: string;
}

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
        options: field.options,
        mask: field.mask,
        default_value: field.default_value,
      });
    } else {
      setCurrentField(null);
      setFormData({
        name: "",
        label: "",
        type: "text",
        required: false,
        display_in_kanban: false,
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
      const newField = {
        ...data,
        pipeline_id: pipelineId,
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
      const { error } = await supabase
        .from('crm_fields')
        .update(data)
        .eq('id', currentField.id);

      if (error) throw error;

      setFields(fields.map(field => 
        field.id === currentField.id 
          ? { ...field, ...data }
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

  const handleFormChange = (key: keyof FieldFormData, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSubmit = () => {
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
    handleOpenDialog,
    handleCloseDialog,
    handleFormChange,
    handleSubmit,
    handleDeleteField,
    isSaving,
    getDefaultMask
  };
};
