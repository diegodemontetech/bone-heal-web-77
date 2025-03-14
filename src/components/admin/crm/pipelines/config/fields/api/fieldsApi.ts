
import { supabase } from "@/integrations/supabase/client";
import { CRMField } from "@/types/crm";

// Definindo explicitamente o tipo para o FieldFormData para evitar tipagem excessiva
export interface FieldFormData {
  name: string;
  label: string;
  type: string;
  required: boolean;
  display_in_kanban: boolean;
  options?: string;
  mask?: string;
  default_value?: string;
}

export const fetchFieldsFromPipeline = async (pipelineId: string): Promise<CRMField[]> => {
  try {
    const { data, error } = await supabase
      .from("crm_fields")
      .select("*")
      .eq("pipeline_id", pipelineId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Simplificar o type assertion
    return data as CRMField[] || [];
  } catch (error) {
    console.error("Error fetching fields:", error);
    throw error;
  }
};

export const createField = async (pipelineId: string, formData: FieldFormData): Promise<CRMField> => {
  try {
    // Processar opções de campos do tipo select, radio, checkbox
    const options = ["select", "radio", "checkbox"].includes(formData.type) && formData.options
      ? formData.options.split(",").map(opt => opt.trim())
      : null;

    const { data, error } = await supabase
      .from("crm_fields")
      .insert([{
        pipeline_id: pipelineId,
        name: formData.name,
        label: formData.label,
        type: formData.type,
        required: formData.required,
        display_in_kanban: formData.display_in_kanban,
        options: options,
        mask: formData.mask || null,
        default_value: formData.default_value || null
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Simplificar o type assertion
    return data as CRMField;
  } catch (error) {
    console.error("Error creating field:", error);
    throw error;
  }
};

export const updateField = async (fieldId: string, formData: FieldFormData): Promise<CRMField> => {
  try {
    // Processar opções de campos do tipo select, radio, checkbox
    const options = ["select", "radio", "checkbox"].includes(formData.type) && formData.options
      ? formData.options.split(",").map(opt => opt.trim())
      : null;

    const { data, error } = await supabase
      .from("crm_fields")
      .update({
        name: formData.name,
        label: formData.label,
        type: formData.type,
        required: formData.required,
        display_in_kanban: formData.display_in_kanban,
        options: options,
        mask: formData.mask || null,
        default_value: formData.default_value || null
      })
      .eq("id", fieldId)
      .select()
      .single();

    if (error) throw error;
    
    // Usar type assertion para evitar a recursão de tipo
    return data as CRMField;
  } catch (error) {
    console.error("Error updating field:", error);
    throw error;
  }
};

export const deleteField = async (fieldId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("crm_fields")
      .delete()
      .eq("id", fieldId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting field:", error);
    throw error;
  }
};
