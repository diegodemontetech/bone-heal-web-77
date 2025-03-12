
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { convertMessageFormat, WhatsAppMessage } from '@/components/admin/whatsapp/types';

export const useWhatsAppMessages = (instanceId: string, contactNumber: string) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .or(`from.eq.${contactNumber},to.eq.${contactNumber}`)
        .order('timestamp', { ascending: true });

      if (error) {
        throw error;
      }

      // Convertendo mensagens para o formato esperado usando a função de conversão
      const formattedMessages = data?.map(msg => convertMessageFormat(msg)) || [];
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [instanceId, contactNumber]);

  const sendMessage = async (message: string, media?: { url: string, type: string }): Promise<boolean> => {
    try {
      // Preparar mensagem no formato esperado pelo banco de dados
      const msgData = {
        instance_id: instanceId,
        lead_id: "", // Será preenchido pelo backend
        message: message,
        direction: 'outbound',
        is_bot: false,
        created_at: new Date().toISOString(),
        media_url: media?.url || null,
        media_type: media?.type || null,
        sender_id: 'me', // placeholder
      };

      // Salvar no banco de dados
      const { error: msgError } = await supabase
        .from('whatsapp_messages')
        .insert([msgData]);

      if (msgError) throw msgError;

      // Enviar via API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instanceId,
          to: contactNumber,
          message,
          media
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      fetchMessages();
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return false;
    }
  };

  useEffect(() => {
    if (instanceId && contactNumber) {
      fetchMessages();
    }
  }, [fetchMessages, instanceId, contactNumber]);

  return {
    messages,
    loading,
    sendMessage
  };
};
