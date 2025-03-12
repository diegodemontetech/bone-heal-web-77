
export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string;
  event_type: string;
  trigger_event?: string;
  variables?: any[];
  active?: boolean;
  auto_send?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmailLogEntry {
  id: string;
  template_id?: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  body: string;
  status: 'success' | 'error' | 'pending';
  error_message?: string;
  variables_used?: any;
  sent_at: string;
}
