
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { LeadInfo, MessageData } from '../_shared/types.ts';

// Processa o lead (cria novo ou atualiza existente)
export async function processLead(
  supabase: ReturnType<typeof createClient>,
  messageData: MessageData
): Promise<LeadInfo> {
  // Verificar se o lead já existe
  const { data: existingLead } = await supabase
    .from('leads')
    .select('id, status, name')
    .eq('phone', messageData.phone)
    .maybeSingle();
  
  let leadId;
  let needsHumanAgent = false;
  
  if (existingLead) {
    // Atualiza lead existente
    leadId = existingLead.id;
    
    // Verificar se o lead já está em atendimento humano
    if (existingLead.status === 'atendido_humano') {
      needsHumanAgent = true;
    } else {
      // Atualizar status para 'aguardando'
      await supabase
        .from('leads')
        .update({
          last_contact: messageData.timestamp,
          status: 'aguardando',
        })
        .eq('id', leadId);
    }
  } else {
    // Cria novo lead
    const { data: newLead } = await supabase
      .from('leads')
      .insert({
        phone: messageData.phone, 
        name: messageData.name || messageData.phone, 
        last_contact: messageData.timestamp,
        source: 'whatsapp_webhook',
        status: 'novo'
      })
      .select()
      .single();
    
    leadId = newLead.id;
  }
  
  // Registrar mensagem recebida
  await supabase.from('whatsapp_messages').insert({
    lead_id: leadId,
    message: messageData.message,
    direction: 'inbound',
    sent_by: 'cliente'
  });

  return {
    id: leadId,
    status: existingLead?.status || 'novo',
    name: messageData.name,
    needsHumanAgent
  };
}

// Atualiza o lead para atendimento humano
export async function updateLeadForHumanAttendance(
  supabase: ReturnType<typeof createClient>,
  leadId: string
): Promise<void> {
  await supabase
    .from('leads')
    .update({ 
      needs_human: true,
      status: 'atendido_humano'
    })
    .eq('id', leadId);
}
