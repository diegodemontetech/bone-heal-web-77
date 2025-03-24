
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
  instances: any[];
  isLoading: boolean;
  onConnect: (instanceId: string) => Promise<void>;
  onDisconnect: (instanceId: string) => Promise<boolean>;
  onDelete: (instanceId: string) => Promise<boolean>;
  onCreateInstance: (name: string) => Promise<any>;
  onCreateDialogOpen?: () => void;
}

export interface WhatsAppInstanceCardProps {
  instance: any;
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
