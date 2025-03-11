
// Tipos compartilhados para as funções do webhook WhatsApp
export interface WhatsAppMessagePayload {
  data?: {
    key?: {
      remoteJid?: string;
    };
    message?: {
      conversation?: string;
      extendedTextMessage?: {
        text: string;
      };
    };
    pushName?: string;
  };
  phone?: string;
  body?: string;
  message?: string;
  name?: string;
  contactName?: string;
  instance?: string;
}

export interface LeadInfo {
  id: string;
  status: string;
  name: string;
  needsHumanAgent: boolean;
}

export interface MessageData {
  leadId: string;
  message: string;
  timestamp: string;
  isEvolutionApi: boolean;
  phone: string;
  name: string;
  instance?: string;
}
