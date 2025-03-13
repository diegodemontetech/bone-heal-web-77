
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Notifica os administradores sobre necessidade de atendimento humano
export async function notifyAdminsAboutHumanNeeded(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  name: string,
  phone: string
): Promise<void> {
  await supabase.from('notifications').insert({
    type: 'whatsapp_human_needed',
    lead_id: leadId,
    message: `Cliente ${name || phone} precisa de atendimento humano via WhatsApp`,
    status: 'pending'
  });
}
