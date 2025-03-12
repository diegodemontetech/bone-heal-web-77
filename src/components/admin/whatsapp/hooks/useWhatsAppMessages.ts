
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WhatsAppMessage } from '../types';

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
          ...payload.new as any,
          sent_by: (payload.new as any).direction === 'outbound' ? 'us' : 'them',
          // Campos compatíveis
          from: (payload.new as any).direction === 'outbound' ? 'system' : leadId,
          to: (payload.new as any).direction === 'outbound' ? leadId : 'system',
          body: (payload.new as any).message,
          type: (payload.new as any).media_type || 'text',
          timestamp: (payload.new as any).created_at,
          is_sent_by_me: (payload.new as any).direction === 'outbound'
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
