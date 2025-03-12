
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
  from: string;
  to: string;
  body: string;
  type: string;
  timestamp: string;
  is_sent_by_me: boolean;
  media_url?: string;
  media_type?: string;
}
