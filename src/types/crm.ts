
export interface Contact {
  id: string;
  full_name: string;
  stage_id: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  created_at: string;
  updated_at: string;
  last_interaction: string;
  stage?: Stage;
}

export interface Stage {
  id: string;
  name: string;
  color: string;
  pipeline_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Pipeline {
  id: string;
  name: string;
  department_id: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  interaction_type: string;
  content: string;
  interaction_date: string;
  created_at: string;
  user_id: string;
  contact_id: string;
  user?: {
    id: string;
    full_name: string;
    email?: string;
  };
}

export interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
  contact_id: string;
  user_id: string;
  user?: {
    id: string;
    full_name: string;
    email?: string;
  };
}

export interface Department {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
