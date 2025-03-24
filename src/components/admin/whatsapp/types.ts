
export interface WhatsAppMessage {
  id: string;
  message: string;
  direction: string;
  is_bot: boolean;
  created_at: string;
  media_url?: string;
  media_type?: string;
  isFromMe?: boolean;
  timestamp?: string;
  body?: string;
  sent_by?: string;
  lead_id: string;
  instance_id: string | null;
  sender_id: string | null;
  type?: string; // Added type field
}

export interface WhatsAppInstance {
  id: string;
  name: string;
  instance_name: string;
  status: string;
  qr_code: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppChatProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
  onMessageSent?: () => void;
  selectedLead: any;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
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
  messages: WhatsAppMessage[];
  onSendMessage: (message: string) => Promise<boolean>;
  isLoading: boolean;
  messagesLoading?: boolean;
  selectedInstanceId?: string;
}

export interface InstancesTabProps {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  onConnect: (instanceId: string) => Promise<void>;
  onDisconnect: (instanceId: string) => Promise<boolean>;
  onDelete: (instanceId: string) => Promise<boolean>;
  onCreateInstance: (name: string) => Promise<any>;
  onCreateDialogOpen?: () => void;  // Made this optional
}

export interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  onConnect: (instanceId: string) => Promise<void>;
  onDisconnect: (instanceId: string) => Promise<boolean>;
  onDelete: (instanceId: string) => Promise<boolean>;
}

export interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  isCreating: boolean;
  onClose: () => void;
}

export interface InstanceNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  instanceName: string;
  setInstanceName: (value: string) => void;
}

export interface CreateInstanceDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onCreateInstance: (name: string) => Promise<any>;
}

// Utility function to convert message format
export const convertMessageFormat = (message: any): WhatsAppMessage => {
  return {
    id: message.id || '',
    message: message.message || message.body || '',
    direction: message.direction || (message.isFromMe ? 'outgoing' : 'incoming'),
    is_bot: message.is_bot || false,
    created_at: message.created_at || message.timestamp || new Date().toISOString(),
    media_url: message.media_url || null,
    media_type: message.media_type || null,
    isFromMe: message.isFromMe || message.direction === 'outgoing',
    timestamp: message.timestamp || message.created_at,
    body: message.body || message.message,
    sent_by: message.sent_by || null,
    lead_id: message.lead_id || '',
    instance_id: message.instance_id || null,
    sender_id: message.sender_id || null,
    type: message.type || null
  };
};
