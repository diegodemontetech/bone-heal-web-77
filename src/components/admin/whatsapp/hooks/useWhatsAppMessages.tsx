
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWhatsAppMessages = (selectedLead: any, onMessageSent: () => void) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedLead?.id) {
      fetchMessages();
      
      // Inscrever-se para atualizações das mensagens
      const subscription = supabase
        .channel(`messages-${selectedLead.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `lead_id=eq.${selectedLead.id}`
        }, () => {
          fetchMessages();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(subscription);
      };
    } else {
      setMessages([]);
    }
  }, [selectedLead?.id]);

  const fetchMessages = async () => {
    if (!selectedLead?.id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select(`
          id,
          message,
          direction,
          is_bot,
          created_at,
          sender:sender_id(full_name),
          media_url,
          media_type
        `)
        .eq('lead_id', selectedLead.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Se há mensagens não lidas, marcar lead como não precisando mais de atendimento humano
      if (selectedLead.needs_human) {
        await supabase
          .from('leads')
          .update({ needs_human: false })
          .eq('id', selectedLead.id);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!selectedLead?.id || !text.trim()) return;
    
    try {
      // Primeiro, adicionar a mensagem ao banco de dados
      const { data: msgData, error: msgError } = await supabase
        .from('whatsapp_messages')
        .insert({
          lead_id: selectedLead.id,
          message: text,
          direction: 'outgoing',
          is_bot: false,
          sender_id: supabase.auth.getUser()?.data?.user?.id
        })
        .select()
        .single();
        
      if (msgError) throw msgError;
      
      // Atualizar status do lead
      await supabase
        .from('leads')
        .update({ 
          status: 'atendido_humano',
          last_contact: new Date().toISOString(),
          needs_human: false
        })
        .eq('id', selectedLead.id);
      
      // Enviar mensagem pelo WhatsApp através do edge function
      const { error: sendError } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: selectedLead.phone,
          message: text
        }
      });
      
      if (sendError) {
        toast.error(`Erro ao enviar mensagem: ${sendError.message}`);
        console.error('Erro ao enviar mensagem:', sendError);
      }
      
      // Atualizar lista de mensagens
      await fetchMessages();
      
      // Notificar o componente pai
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages: fetchMessages
  };
};
