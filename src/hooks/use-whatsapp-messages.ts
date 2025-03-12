
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppMessage } from '@/types/automation';

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

      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [instanceId, contactNumber]);

  const sendMessage = async (message: string, media?: { url: string, type: string }): Promise<boolean> => {
    try {
      // First save to our database
      const { data: msgData, error: msgError } = await supabase
        .from('whatsapp_messages')
        .insert([{
          instance_id: instanceId,
          from: 'me', // placeholder, will be updated by backend
          to: contactNumber,
          body: message,
          type: media ? 'media' : 'text',
          timestamp: new Date().toISOString(),
          is_sent_by_me: true,
          media_url: media?.url,
          media_type: media?.type,
        }]);

      if (msgError) throw msgError;

      // Then send via API
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
