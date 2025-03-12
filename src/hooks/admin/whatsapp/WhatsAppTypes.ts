
import { WhatsAppMessage, WhatsAppInstance } from "@/components/admin/whatsapp/types";

export interface WhatsAppDialogState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface WhatsAppTabsState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedInstanceId: string | null;
  setSelectedInstanceId: (id: string | null) => void;
}
