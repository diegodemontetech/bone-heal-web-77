
import { Edge, Node } from 'reactflow';
import { Json } from '@/integrations/supabase/types';
import { WhatsAppMessage as ComponentWhatsAppMessage } from '@/components/admin/whatsapp/types';

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
  // Campos como from e to não são mais necessários
  body: string;
  type: string;
  timestamp: string;
  is_sent_by_me: boolean;
  media_url?: string;
  media_type?: string;
  
  // Campos adicionados para compatibilidade com outros componentes
  lead_id?: string;
  message?: string;
  direction?: string;
  sent_by?: string;
  is_bot?: boolean;
  created_at?: string;
  sender_id?: string;
}

// Converter mensagem entre os dois formatos
export function convertToComponentMessage(message: WhatsAppMessage): ComponentWhatsAppMessage {
  return {
    id: message.id,
    lead_id: message.lead_id || '',
    body: message.body,
    message: message.body, // Mapeamento adicional
    type: message.type,
    timestamp: message.timestamp,
    created_at: message.timestamp, // Mapeamento adicional
    is_sent_by_me: message.is_sent_by_me,
    sent_by: message.is_sent_by_me ? 'us' : 'them', // Mapeamento adicional
    direction: message.is_sent_by_me ? 'outbound' : 'inbound', // Mapeamento adicional
    media_url: message.media_url,
    media_type: message.media_type,
    instance_id: message.instance_id,
    is_bot: false
  };
}
