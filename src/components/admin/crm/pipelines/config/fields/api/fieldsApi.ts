
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
    
    // Convertendo o resultado para um tipo seguro
    const fields: CRMField[] = data ? data.map(item => ({
      id: item.id,
      name: item.name,
      label: item.label,
      type: item.type,
      required: item.required,
      display_in_kanban: item.display_in_kanban,
      options: item.options,
      mask: item.mask,
      default_value: item.default_value,
      pipeline_id: item.pipeline_id,
      created_at: item.created_at,
      updated_at: item.updated_at
    })) : [];
    
    return fields;
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
    
    if (!data) {
      throw new Error("No data returned after creating field");
    }
    
    // Convertendo o resultado para um tipo seguro
    const field: CRMField = {
      id: data.id,
      name: data.name,
      label: data.label,
      type: data.type,
      required: data.required,
      display_in_kanban: data.display_in_kanban,
      options: data.options,
      mask: data.mask,
      default_value: data.default_value,
      pipeline_id: data.pipeline_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return field;
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
    
    if (!data) {
      throw new Error("No data returned after updating field");
    }
    
    // Convertendo o resultado para um tipo seguro
    const field: CRMField = {
      id: data.id,
      name: data.name,
      label: data.label,
      type: data.type,
      required: data.required,
      display_in_kanban: data.display_in_kanban,
      options: data.options,
      mask: data.mask,
      default_value: data.default_value,
      pipeline_id: data.pipeline_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return field;
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
