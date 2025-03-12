
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
  selectInstance: (id: string) => void;
}

export interface OrderWithJson {
  id: string;
  user_id?: string;
  total_amount: number;
  shipping_address?: {
    zip_code?: string;
    city?: string;
    state?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
  };
  items: any;
  created_at: string;
  updated_at: string;
  payment_status?: string;
  status: string;
  profiles?: {
    zip_code?: string;
    city?: string;
    state?: string;
    address?: string;
    endereco_numero?: string;
    complemento?: string;
    neighborhood?: string;
  };
}
