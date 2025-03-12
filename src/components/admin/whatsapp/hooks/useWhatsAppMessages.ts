
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";

// Interface para mensagens do WhatsApp
export interface WhatsAppMessageType {
  id: string;
  created_at: string;
  direction: string;
  message: string;
  lead_id: string;
  is_bot: boolean;
  media_url?: string | null;
  media_type?: string | null;
  sender_id?: string | null;
  instance_id?: string | null;
}

export const useWhatsAppMessages = (leadId?: string) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<WhatsAppMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Função para carregar mensagens
  const fetchMessages = async () => {
    if (!leadId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      // Converte os dados para o tipo WhatsAppMessageType
      setMessages(data as WhatsAppMessageType[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao carregar mensagens"));
      console.error("Erro ao carregar mensagens do WhatsApp:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar mensagem
  const sendMessage = async (message: string, media?: { url: string; type: string }) => {
    if (!leadId || !profile) {
      console.error("Não é possível enviar mensagem: leadId ou profile não definidos");
      return;
    }

    try {
      const newMessage = {
        lead_id: leadId,
        message,
        direction: "outgoing",
        is_bot: false,
        sender_id: profile.id,
        media_url: media?.url,
        media_type: media?.type
      };

      const { data, error } = await supabase
        .from("whatsapp_messages")
        .insert([newMessage])
        .select();

      if (error) throw error;

      // Adiciona a nova mensagem à lista
      if (data && data.length > 0) {
        setMessages(prevMessages => [...prevMessages, data[0] as WhatsAppMessageType]);
      }

      // Aqui você pode adicionar lógica para enviar a mensagem pelo WhatsApp
      // Usando uma função Edge do Supabase, por exemplo

      return true;
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      return false;
    }
  };

  // Carregar mensagens iniciais
  useEffect(() => {
    fetchMessages();
  }, [leadId]);

  // Configurar subscription para atualização em tempo real
  useEffect(() => {
    if (!leadId) return;

    const subscription = supabase
      .channel(`lead-${leadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT", 
          schema: "public",
          table: "whatsapp_messages",
          filter: `lead_id=eq.${leadId}`
        },
        (payload) => {
          // Tipando corretamente o payload
          const newMessage = payload.new as WhatsAppMessageType;
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [leadId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: fetchMessages
  };
};
