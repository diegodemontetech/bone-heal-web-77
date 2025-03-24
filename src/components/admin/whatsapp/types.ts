
export interface WhatsAppMessage {
  id: string;
  message: string;
  direction: 'inbound' | 'outbound';
  is_bot: boolean;
  created_at: string;
  lead_id?: string;
  media_url?: string | null;
  media_type?: string | null;
  sender_id?: string | null;
  instance_id?: string | null;
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

export interface WhatsAppChatProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  onSendMessage: (message: string, media?: { url: string; type: string }) => Promise<boolean>;
  selectedLead: any;
  onMessageSent: () => void;
}

export interface ChatInputProps {
  onSendMessage: (text: string) => Promise<boolean>;
  isDisabled?: boolean;
}

export interface ChatMessageProps {
  message: WhatsAppMessage;
  isUser: boolean;
}

export interface ChatMessagesProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
}

export interface ChatTabProps {
  instanceId: string;
  messages: WhatsAppMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
}

export interface CreateInstanceDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onCreateInstance: (instanceName: string) => Promise<WhatsAppInstance | null>;
}

export interface DialogActionsProps {
  isCreating: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export interface InstanceNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  instanceName?: string;
  setInstanceName?: (name: string) => void;
}

export interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  onSelect: () => void;
  onRefreshQr: () => Promise<any>;
  onDelete: () => void;
  key?: string;
}

export interface InstancesTabProps {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  onCreateInstance: () => void;
  onSelectInstance: (instanceId: string) => void;
  onRefreshQr: (instanceId: string) => Promise<any>;
  onDeleteInstance: (instanceId: string) => Promise<boolean>;
}

export const convertMessageFormat = (message: any): WhatsAppMessage => {
  return {
    id: message.id || '',
    message: message.message || message.body || '',
    direction: message.direction || (message.is_sent_by_me ? 'outbound' : 'inbound'),
    is_bot: message.is_bot || false,
    created_at: message.created_at || message.timestamp || new Date().toISOString(),
    lead_id: message.lead_id || null,
    media_url: message.media_url || null,
    media_type: message.media_type || null,
    sender_id: message.sender_id || null,
    instance_id: message.instance_id || null
  };
};
