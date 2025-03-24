
// Definições de tipos para o CRM
export interface Stage {
  id: string;
  name: string;
  color: string;
  pipeline_id: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id?: string;
  full_name: string;
  stage_id: string;
  cro?: string;
  cpf_cnpj?: string;
  specialty?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  clinic_name?: string;
  client_type?: string;
  responsible_id?: string;
  next_interaction_date?: string;
  observations?: string;
  next_steps?: string;
  last_interaction?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Interaction {
  id: string;
  interaction_type: string;
  content: string;
  interaction_date: string;
  created_at: string;
  user_id?: string;
  user?: {
    full_name: string;
  };
}

export interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  created_at: string;
  user_id?: string;
  user?: {
    full_name: string;
  };
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
