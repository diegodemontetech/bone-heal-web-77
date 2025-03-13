
import { Json } from "@/integrations/supabase/types";

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  form_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CRMStage {
  id: string;
  name: string;
  color: string;
  order: number;
  pipeline_id?: string;
  department_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CRMField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  display_in_kanban: boolean;
  options?: string[];
  mask?: string;
  default_value?: string;
  pipeline_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CRMFormSettings {
  id: string;
  pipeline_id?: string;
  title?: string;
  description?: string;
  success_message?: string;
  redirect_url?: string;
  theme_color?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CRMPipelinePermission {
  id: string;
  pipeline_id?: string;
  user_id?: string;
  permission: string;
  created_at?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  status: string;
  stage: string;
  source: string;
  created_at: string;
  updated_at: string;
  last_contact: string;
  needs_human: boolean;
  notes?: string;
  tags?: string[];
  assigned_to?: string;
  orders?: any[];
}

// Interface para o formulário de estágios
export interface StageFormValues {
  name: string;
  color: string;
  department_id: string;
  order?: number;
  pipeline_id?: string;
}

export interface AutomationFormValues {
  name?: string; 
  description?: string;
  is_active?: boolean;
  action_type: "stage_change" | "notification" | "assign_user" | "webhook";
  trigger_type?: "stage_change" | "time_in_stage" | "lead_created";
  stage_id?: string;
  next_stage_id?: string;
  hours_trigger?: number;
  user_id?: string;
  email_template_id?: string;
  webhook_url?: string;
  action_data?: any;
}

// Interface para o estágio com pipeline_id garantido
export interface StageWithPipeline extends CRMStage {
  pipeline_id: string;
}
