
import { Edge, Node } from 'reactflow';
import { Json } from '@/integrations/supabase/types';

export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  nodes: Node[];
  edges: Edge[];
  created_at: string;
  updated_at: string;
}

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
  instance_id: string;
  message: string;
  type: string;
  timestamp: string;
  isFromMe: boolean;
  mediaUrl?: string;
  mediaType?: string;
  
  // Campos adicionados para compatibilidade com outros componentes
  lead_id?: string;
  direction?: string;
  sent_by?: string;
  is_bot?: boolean;
  created_at?: string;
  sender_id?: string;
}

// Converter mensagem entre os dois formatos
export function convertToComponentMessage(message: WhatsAppMessage): WhatsAppMessage {
  return {
    id: message.id,
    lead_id: message.lead_id || '',
    message: message.message || '', 
    type: message.type,
    timestamp: message.timestamp,
    created_at: message.timestamp, // Mapeamento adicional
    isFromMe: message.isFromMe,
    sent_by: message.isFromMe ? 'us' : 'them', // Mapeamento adicional
    direction: message.isFromMe ? 'outbound' : 'inbound', // Mapeamento adicional
    mediaUrl: message.mediaUrl,
    mediaType: message.mediaType,
    instance_id: message.instance_id,
    is_bot: false
  };
}
