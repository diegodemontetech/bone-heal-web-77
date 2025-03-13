
import { supabase } from "@/integrations/supabase/client";
import { CRMField } from "@/types/crm";
import { FieldFormData } from "../types";

/**
 * Busca todos os campos de um pipeline
 */
export const fetchFieldsFromPipeline = async (pipelineId: string) => {
  const { data, error } = await supabase
    .from('crm_fields')
    .select('*')
    .eq('pipeline_id', pipelineId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  
  // Tipagem explícita para evitar erros de inferência profunda
  return (data || []) as CRMField[];
};

/**
 * Cria um novo campo
 */
export const createField = async (pipelineId: string, data: FieldFormData) => {
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
  
  return createdField as CRMField;
};

/**
 * Atualiza um campo existente
 */
export const updateField = async (fieldId: string, data: FieldFormData) => {
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
    .eq('id', fieldId);

  if (error) throw error;
  
  return updatedField;
};

/**
 * Exclui um campo
 */
export const deleteField = async (fieldId: string) => {
  const { error } = await supabase
    .from('crm_fields')
    .delete()
    .eq('id', fieldId);

  if (error) throw error;
  
  return true;
};
