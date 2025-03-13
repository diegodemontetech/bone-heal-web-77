
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CRMField } from "@/types/crm";
import { FieldFormData } from "./types";
import { fetchFieldsFromPipeline, createField, updateField, deleteField } from "./api/fieldsApi";
import { useFormHandlers } from "./handlers/formHandlers";
import { getDefaultMask } from "./utils/defaultMasks";

export const useFieldsConfig = (pipelineId: string) => {
  const [fields, setFields] = useState<CRMField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<CRMField | null>(null);
  
  const { 
    formData, 
    setFormData, 
    handleInputChange, 
    handleSwitchChange, 
    handleSelectChange 
  } = useFormHandlers(currentField);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const fetchedFields = await fetchFieldsFromPipeline(pipelineId);
      setFields(fetchedFields);
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

  const handleCreateField = async () => {
    setIsSaving(true);
    try {
      const createdField = await createField(pipelineId, formData);
      setFields([...fields, createdField]);
      toast.success('Campo criado com sucesso!');
      handleCloseDialog();
    } catch (error: any) {
      console.error('Erro ao criar campo:', error);
      toast.error(`Erro ao criar campo: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateField = async () => {
    if (!currentField) return;
    
    setIsSaving(true);
    try {
      const updatedFieldData = await updateField(currentField.id, formData);
      
      setFields(fields.map(field => 
        field.id === currentField.id 
          ? { ...field, ...updatedFieldData }
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
      await deleteField(fieldId);
      setFields(fields.filter(field => field.id !== fieldId));
      toast.success('Campo excluído com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir campo:', error);
      toast.error(`Erro ao excluir campo: ${error.message}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentField) {
      handleUpdateField();
    } else {
      handleCreateField();
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
