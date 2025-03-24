
export interface WhatsAppInstance {
  id: string;
  name: string;
  instance_name: string;
  status: string;
  qr_code: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  message: string;
  direction: 'inbound' | 'outbound';
  timestamp: string;
  isFromMe: boolean;
  mediaUrl?: string;
  mediaType?: string;
  lead_id?: string;
}

export interface WhatsAppContact {
  id: string;
  name: string;
  number: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

// Função para converter mensagens do formato do banco para o formato exibido no componente
export function convertMessageFormat(message: any): WhatsAppMessage {
  return {
    id: message.id,
    message: message.message,
    direction: message.direction,
    timestamp: message.created_at,
    isFromMe: message.direction === 'outbound',
    mediaUrl: message.media_url,
    mediaType: message.media_type,
    lead_id: message.lead_id
  };
}
