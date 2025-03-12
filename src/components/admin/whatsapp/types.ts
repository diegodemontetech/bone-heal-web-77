
export interface WhatsAppInstance {
  id: string;
  instance_name: string;
  name?: string;
  status: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface WhatsAppChatProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  onSendMessage: (message: string, media?: { url: string, type: string }) => Promise<boolean>;
  selectedLead?: any;
  onMessageSent?: () => void;
}

export interface WhatsAppMessage {
  id: string;
  lead_id: string;
  message: string;
  direction: string;
  sent_by: string;
  is_bot: boolean;
  created_at: string;
  media_type?: string;
  media_url?: string;
  instance_id?: string;
  sender_id?: string;
  // Campos compatíveis com a interface esperada em outros componentes
  from?: string;
  to?: string;
  body?: string;
  type?: string;
  timestamp?: string;
  is_sent_by_me?: boolean;
}
