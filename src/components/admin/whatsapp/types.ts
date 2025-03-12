
import { WhatsAppMessage } from './hooks/useWhatsAppMessages';

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
}
