
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppMessage } from '@/components/admin/whatsapp/types';
import { toast } from 'sonner';

export const useWhatsAppMessages = (leadId: string | undefined) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('whatsapp_messages')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at');
          
        if (error) throw error;
        
        // Mapear para garantir a tipagem correta
        const typedMessages: WhatsAppMessage[] = data.map(msg => ({
          id: msg.id,
          lead_id: msg.lead_id,
          message: msg.message,
          direction: msg.direction as 'inbound' | 'outbound',
          // Handle sent_by if it exists
          ...(msg.sent_by && { sent_by: msg.sent_by }),
          is_bot: msg.is_bot,
          created_at: msg.created_at,
          media_type: msg.media_type,
          media_url: msg.media_url,
          instance_id: msg.instance_id,
          sender_id: msg.sender_id
        }));
        
        setMessages(typedMessages);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        toast.error("Falha ao carregar histórico de conversas");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Configurar subscription para mensagens em tempo real
    const subscription = supabase
      .channel('whatsapp_messages_channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'whatsapp_messages',
        filter: `lead_id=eq.${leadId}`
      }, (payload) => {
        const newMessage: WhatsAppMessage = {
          id: payload.new.id,
          lead_id: payload.new.lead_id,
          message: payload.new.message,
          direction: payload.new.direction,
          sent_by: payload.new.sent_by,
          is_bot: payload.new.is_bot,
          created_at: payload.new.created_at,
          media_type: payload.new.media_type,
          media_url: payload.new.media_url,
          instance_id: payload.new.instance_id,
          sender_id: payload.new.sender_id
        };
        
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [leadId]);

  const sendMessage = async (message: string, media?: { url: string, type: string }) => {
    if (!leadId || !message.trim()) return false;
    
    try {
      const newMessage = {
        lead_id: leadId,
        message,
        direction: 'outbound',
        is_bot: false,
        media_url: media?.url,
        media_type: media?.type,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('whatsapp_messages')
        .insert(newMessage);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Falha ao enviar mensagem");
      return false;
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
};
