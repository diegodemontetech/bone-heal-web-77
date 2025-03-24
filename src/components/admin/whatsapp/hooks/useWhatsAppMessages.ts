
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppMessage, convertMessageFormat } from "@/components/admin/whatsapp/types";

export const useWhatsAppMessages = (selectedLeadId: string | null, instanceId: string | null) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para buscar mensagens
  const fetchMessages = async () => {
    if (!selectedLeadId || !instanceId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("lead_id", selectedLeadId)
        .eq("instance_id", instanceId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Converter para o formato esperado
      const convertedMessages: WhatsAppMessage[] = (data || []).map(msg => 
        convertMessageFormat(msg)
      );
      
      setMessages(convertedMessages);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar mensagens quando o lead selecionado mudar
  useEffect(() => {
    fetchMessages();
  }, [selectedLeadId, instanceId]);

  // Função para enviar mensagem
  const sendMessage = async (message: string): Promise<boolean> => {
    if (!selectedLeadId || !instanceId || !message.trim()) {
      return false;
    }

    try {
      // Criar mensagem no banco
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .insert({
          lead_id: selectedLeadId,
          instance_id: instanceId,
          message: message,
          type: "text",
          direction: "outbound",
          is_sent_by_me: true,
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      // Adicionar mensagem à lista
      if (data && data[0]) {
        const newMessage = convertMessageFormat(data[0]);
        setMessages(prev => [...prev, newMessage]);
      }

      // Enviar mensagem via API
      const { error: sendError } = await supabase.functions.invoke("send-whatsapp", {
        body: {
          to: selectedLeadId,
          message: message,
          instanceId: instanceId
        }
      });

      if (sendError) throw sendError;
      
      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return false;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages: fetchMessages
  };
};
