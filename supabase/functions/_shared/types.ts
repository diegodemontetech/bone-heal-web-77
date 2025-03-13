
// Tipos compartilhados para funções do WhatsApp
export interface WhatsAppMessagePayload {
  data?: any;
  instance?: string;
  phone?: string;
  body?: string;
  message?: string;
  name?: string;
  contactName?: string;
}

export interface WhatsAppConfig {
  evolutionApiUrl?: string;
  evolutionApiKey?: string;
  zApiInstanceId?: string;
  zApiToken?: string;
}

export interface SendMessageOptions {
  phone: string;
  message: string;
  instanceName?: string;
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
  phone: string;
  name: string;
  isEvolutionApi: boolean;
  timestamp: string;
  instance?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  result?: any;
}

export interface GeminiAnalysisResult {
  resposta: string;
  intencao: string;
  transferir: boolean;
}
