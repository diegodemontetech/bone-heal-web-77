
export interface WhatsAppInstance {
  id: string;
  name?: string;
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
  body?: string;
  type?: string;
  is_sent_by_me?: boolean;
  sent_by?: string;
  created_at?: string;
  instance_id?: string;
  is_bot?: boolean;
  sender_id?: string;
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
    message: message.message || message.body || '',
    body: message.message || message.body || '',
    direction: message.direction || (message.is_sent_by_me ? 'outbound' : 'inbound'),
    timestamp: message.created_at || message.timestamp || new Date().toISOString(),
    isFromMe: message.is_sent_by_me || message.isFromMe || message.direction === 'outbound',
    is_sent_by_me: message.is_sent_by_me || message.isFromMe || message.direction === 'outbound',
    mediaUrl: message.media_url,
    mediaType: message.media_type,
    lead_id: message.lead_id,
    type: message.type || 'text',
    sent_by: message.is_sent_by_me ? 'us' : 'them',
    created_at: message.created_at || message.timestamp || new Date().toISOString(),
    instance_id: message.instance_id || null,
    sender_id: message.sender_id || null
  };
}

// Props para os componentes
export interface WhatsAppChatProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
  selectedLead?: any;
  onMessageSent?: () => void;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  disabled?: boolean;
}

export interface ChatMessageProps {
  message: WhatsAppMessage;
}

export interface ChatMessagesProps {
  messages: WhatsAppMessage[];
  isLoading: boolean;
}

export interface ChatTabProps {
  messages: WhatsAppMessage[];
  messagesLoading: boolean;
  onSendMessage: (message: string) => Promise<boolean>;
  selectedInstanceId: string | null;
}

export interface CreateInstanceDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onCreateInstance: (instanceName: string) => Promise<any>;
}

export interface DialogActionsProps {
  isCreating: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export interface InstanceNameInputProps {
  instanceName: string;
  setInstanceName: (name: string) => void;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onRefreshQr: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface InstancesTabProps {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  onSelect: (id: string) => void;
  onRefreshQr: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateDialogOpen: () => void;
  onSelectInstance: (id: string) => void;
  onDeleteInstance: (id: string) => void;
}
