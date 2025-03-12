
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
  lead_id?: string;
  message?: string;
  direction?: string;
  sent_by?: string;
  is_bot?: boolean;
  created_at?: string;
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

// Função de utilitário para converter entre os formatos de mensagem
export function convertMessageFormat(message: any, toDatabase: boolean = false): WhatsAppMessage {
  if (toDatabase) {
    // Convertendo do formato externo para o formato do banco de dados
    return {
      id: message.id || crypto.randomUUID(),
      lead_id: message.lead_id || '',
      message: message.body || message.message || '',
      direction: message.is_sent_by_me ? 'outbound' : 'inbound',
      sent_by: message.sent_by || (message.is_sent_by_me ? 'user' : 'contact'),
      is_bot: message.is_bot || false,
      created_at: message.timestamp || message.created_at || new Date().toISOString(),
      media_type: message.media_type || '',
      media_url: message.media_url || '',
      instance_id: message.instance_id || '',
      sender_id: message.sender_id || message.from || '',
      from: message.from || '',
      to: message.to || '',
      body: message.body || message.message || '',
      type: message.type || 'text',
      timestamp: message.timestamp || message.created_at || new Date().toISOString(),
      is_sent_by_me: message.is_sent_by_me || message.direction === 'outbound'
    };
  } else {
    // Convertendo do formato do banco de dados para o formato externo
    return {
      id: message.id || crypto.randomUUID(),
      lead_id: message.lead_id || '',
      message: message.message || message.body || '',
      direction: message.direction || (message.is_sent_by_me ? 'outbound' : 'inbound'),
      sent_by: message.sent_by || (message.is_sent_by_me ? 'user' : 'contact'),
      is_bot: message.is_bot || false,
      created_at: message.created_at || message.timestamp || new Date().toISOString(),
      media_type: message.media_type || '',
      media_url: message.media_url || '',
      instance_id: message.instance_id || '',
      sender_id: message.sender_id || message.from || '',
      from: message.from || message.sender_id || '',
      to: message.to || '',
      body: message.body || message.message || '',
      type: message.type || 'text',
      timestamp: message.timestamp || message.created_at || new Date().toISOString(),
      is_sent_by_me: message.is_sent_by_me || message.direction === 'outbound'
    };
  }
}
