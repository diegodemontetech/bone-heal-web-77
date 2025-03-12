
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WhatsAppMessage {
  id: string;
  lead_id: string;
  message: string;
  direction: string;
  sent_by: string;
  is_bot: boolean;
  created_at: string;
  media_type?: string;
  media_url?: string;
  instance_id?: string;
  sender_id?: string;
  // Campos compatíveis com a interface esperada em outros componentes
  from?: string;
  to?: string;
  body?: string;
  type?: string;
  timestamp?: string;
  is_sent_by_me?: boolean;
}

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
        
        // Mapear para garantir a tipagem correta e adicionar os campos compatíveis
        const typedMessages = data.map(msg => ({
          ...msg,
          sent_by: msg.direction === 'outbound' ? 'us' : 'them',
          // Campos compatíveis
          from: msg.direction === 'outbound' ? 'system' : leadId,
          to: msg.direction === 'outbound' ? leadId : 'system',
          body: msg.message,
          type: msg.media_type || 'text',
          timestamp: msg.created_at,
          is_sent_by_me: msg.direction === 'outbound'
        })) as WhatsAppMessage[];
        
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
        const newMessage = {
          ...payload.new,
          sent_by: payload.new.direction === 'outbound' ? 'us' : 'them',
          // Campos compatíveis
          from: payload.new.direction === 'outbound' ? 'system' : leadId,
          to: payload.new.direction === 'outbound' ? leadId : 'system',
          body: payload.new.message,
          type: payload.new.media_type || 'text',
          timestamp: payload.new.created_at,
          is_sent_by_me: payload.new.direction === 'outbound'
        } as WhatsAppMessage;
        
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
      const { error } = await supabase
        .from('whatsapp_messages')
        .insert([{
          lead_id: leadId,
          message,
          direction: 'outbound',
          is_bot: false,
          media_url: media?.url,
          media_type: media?.type
        }]);
        
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
