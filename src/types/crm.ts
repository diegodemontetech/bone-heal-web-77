
export interface Contact {
  id: string;
  full_name: string;
  stage_id: string;
  pipeline_id?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  position?: string;
  cro?: string;
  cpf_cnpj?: string;
  specialty?: string;
  client_type?: string;
  clinic_name?: string;
  address?: string;
  city?: string;
  state?: string;
  observations?: string;
  next_steps?: string;
  responsible_id?: string;
  next_interaction_date?: string;
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
  department_id?: string | null;
  color: string;
  description?: string;
  is_active?: boolean;
  form_url?: string;
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
