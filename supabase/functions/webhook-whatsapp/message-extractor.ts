
import { WhatsAppMessagePayload, MessageData } from '../_shared/types.ts';

// Processa mensagem recebida e extrai informações relevantes
export function processIncomingMessage(payload: WhatsAppMessagePayload): MessageData {
  let phone, message, name, isEvolutionApi = false, instance;
  
  // Detectar formato do Evolution API
  if (payload.data && payload.data.key && payload.data.key.remoteJid) {
    isEvolutionApi = true;
    const jid = payload.data.key.remoteJid;
    phone = jid.split('@')[0];
    instance = payload.instance;
    
    // Extrair mensagem do formato Evolution API
    if (payload.data.message && payload.data.message.conversation) {
      message = payload.data.message.conversation;
    } else if (payload.data.message && payload.data.message.extendedTextMessage) {
      message = payload.data.message.extendedTextMessage.text;
    } else {
      // Pode haver outros formatos como imagem, áudio, etc.
      message = '[Mensagem não textual]';
    }
    
    // Nome pode ser extraído de outras partes do payload
    name = payload.data.pushName || phone;
  } else if (payload.phone) {
    // Formato Z-API
    phone = payload.phone;
    message = payload.body || payload.message || '[Mensagem não textual]';
    name = payload.name || payload.contactName || phone;
  } else {
    throw new Error('Formato de webhook não reconhecido');
  }
  
  // Remover prefixo de país se necessário
  if (phone.startsWith('55')) {
    phone = phone.substring(2);
  }
  
  return {
    leadId: '', // Será preenchido depois
    message,
    phone,
    name,
    isEvolutionApi,
    timestamp: new Date().toISOString(),
    instance
  };
}

// Verifica se a mensagem contém palavras-chave para transferência humana
export function checkHumanTransferKeywords(message: string): boolean {
  const humanKeywords = ['humano', 'pessoa', 'atendente', 'falar com gente', 'falar com pessoa', 'pessoa real'];
  return humanKeywords.some(keyword => message.toLowerCase().includes(keyword));
}
