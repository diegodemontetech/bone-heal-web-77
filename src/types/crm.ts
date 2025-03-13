
export interface Department {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CRMStage {
  id: string;
  name: string;
  color: string;
  department_id: string;
  order: number;
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
  created_at?: string;
  updated_at?: string;
}

export interface CRMAutomation {
  id: string;
  stage: string;
  next_stage?: string;
  hours_trigger?: number;
  action_type: string;
  action_data: any;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  name?: string;
  email?: string;
  phone: string;
  status: string;
  stage: string;
  source: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  last_contact: string;
  needs_human: boolean;
  tags?: string[];
}
