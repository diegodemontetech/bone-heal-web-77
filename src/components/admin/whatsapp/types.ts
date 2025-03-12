
export interface WhatsAppInstance {
  id: string;
  instance_name: string;
  name: string; // nome é obrigatório para compatibilidade
  status: string;
  qr_code: string; // qr_code é obrigatório para compatibilidade com automation.ts
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
  direction: 'inbound' | 'outbound';
  sent_by?: string;
  is_bot: boolean;
  created_at: string;
  media_type?: string;
  media_url?: string;
  instance_id?: string;
  sender_id?: string;
}

export interface CreateInstanceDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onCreateInstance: (name: string) => Promise<boolean>;
  onClose: () => void;
}

export interface InstancesTabProps {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  onSelect: (instanceId: string) => void;
  onRefreshQr: (instanceId: string) => Promise<any>;
  onDelete: (instanceId: string) => Promise<boolean>;
  onCreateDialogOpen: () => void;
}

export interface ChatTabProps {
  messages: WhatsAppMessage[];
  messagesLoading: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
  selectedInstanceId: string | null;
}

