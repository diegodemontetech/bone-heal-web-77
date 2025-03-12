
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WhatsAppMessage, convertMessageFormat } from '@/components/admin/whatsapp/types';

export const useWhatsAppMessages = (instanceId: string | null) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Buscar mensagens quando a instância muda
  useEffect(() => {
    if (instanceId) {
      fetchMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [instanceId]);

  const fetchMessages = async () => {
    if (!instanceId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => convertMessageFormat(msg));
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast.error('Falha ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string): Promise<boolean> => {
    if (!instanceId || !message.trim()) return false;

    try {
      const newMessage: WhatsAppMessage = {
        id: crypto.randomUUID(),
        instance_id: instanceId,
        body: message,
        message: message,
        direction: 'outbound',
        is_sent_by_me: true,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        type: 'text',
        lead_id: '',  // Campo obrigatório no banco de dados
        sender_id: ''  // Pode ser preenchido com o ID do usuário logado
      };

      // 1. Salvar mensagem no banco de dados
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;

      // 2. Adicionar mensagem ao estado local
      setMessages(prev => [...prev, convertMessageFormat(data)]);

      // 3. Enviar mensagem via API Evolution
      const { error: sendError } = await supabase.functions.invoke('evolution-api', {
        body: {
          action: 'sendMessage',
          instanceName: 'default', // Usar nome da instância
          to: '5511999999999', // Destinatário
          body: message
        }
      });

      if (sendError) throw sendError;

      return true;
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      toast.error('Falha ao enviar mensagem');
      return false;
    }
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage
  };
};
