
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from 'sonner';

export const useWhatsAppMessages = (selectedLead: any, onMessageSent: () => void) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (selectedLead?.id) {
      fetchMessages();
      updateLeadStatus();
      
      const subscription = supabase
        .channel('whatsapp-messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `lead_id=eq.${selectedLead.id}`,
        }, (payload) => {
          setMessages(prevMessages => [...prevMessages, payload.new]);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [selectedLead?.id]);
  
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data: messages, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('lead_id', selectedLead.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMessages(messages || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };
  
  const updateLeadStatus = async () => {
    try {
      if (selectedLead?.needs_human) {
        await supabase
          .from('leads')
          .update({ 
            status: 'atendido_humano',
            needs_human: false 
          })
          .eq('id', selectedLead.id);
          
        // Marcar notificações relacionadas como lidas
        await supabase
          .from('notifications')
          .update({ 
            status: 'read',
            read_at: new Date().toISOString()
          })
          .eq('lead_id', selectedLead.id)
          .eq('status', 'pending');
      }
    } catch (error) {
      console.error('Erro ao atualizar status do lead:', error);
    }
  };
  
  const sendMessage = async (messageText: string) => {
    setSending(true);
    try {
      // Enviar mensagem via Edge Function
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: selectedLead.phone,
          message: messageText,
          name: selectedLead.name,
          isAgent: true,
          agentId: profile?.id
        }
      });
      
      if (error) throw error;
      onMessageSent();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
      throw error;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    sendMessage
  };
};
