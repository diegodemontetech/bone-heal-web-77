
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppMessage, convertMessageFormat } from '@/components/admin/whatsapp/types';
import { toast } from 'sonner';

export const useWhatsAppMessages = (leadId: string | undefined | null) => {
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
        const typedMessages: WhatsAppMessage[] = data.map(msg => convertMessageFormat(msg));
        
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
        const newMessage = convertMessageFormat(payload.new);
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
        direction: 'outbound' as const,
        is_bot: false,
        media_url: media?.url,
        media_type: media?.type,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('whatsapp_messages')
        .insert([newMessage]);
        
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
