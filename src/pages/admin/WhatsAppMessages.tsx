
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import LeadsList from '@/components/admin/whatsapp/LeadsList';
import WhatsAppChat from '@/components/admin/whatsapp/WhatsAppChat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { WhatsAppMessage, convertMessageFormat } from '@/components/admin/whatsapp/types';

const AdminWhatsAppMessages = () => {
  const { profile, hasPermission } = useAuth();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [pendingNotifications, setPendingNotifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    
    fetchNotifications();
    checkApiConfiguration();
    
    // Inscrever-se para atualizações das notificações
    const subscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `type=eq.whatsapp_human_needed`,
      }, () => {
        fetchNotifications();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [profile]);

  const fetchNotifications = async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: false })
        .eq('type', 'whatsapp_human_needed')
        .eq('status', 'pending');
        
      if (error) throw error;
      
      if (count !== null) {
        setPendingNotifications(count);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkApiConfiguration = async () => {
    // Verificar se a API de WhatsApp está configurada
    const { data, error } = await supabase.functions.invoke('send-whatsapp', {
      body: { checkConfig: true }
    });
    
    if (error || data?.error) {
      toast.warning('A API de WhatsApp não está configurada corretamente. Verifique as configurações.');
    }
  };
  
  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    if (lead) {
      fetchMessages(lead.id);
    } else {
      setMessages([]);
    }
  };
  
  const fetchMessages = async (leadId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Converter as mensagens para o formato compatível
      const formattedMessages = data.map(msg => convertMessageFormat(msg)) || [];
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setMessagesLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchNotifications();
    if (selectedLead) {
      fetchMessages(selectedLead.id);
    }
  };

  const handleSendMessage = async (message: string, media?: { url: string; type: string }) => {
    if (!selectedLead || !message.trim()) return false;
    
    try {
      const newMessage = {
        lead_id: selectedLead.id,
        message: message,
        direction: 'outbound',
        is_bot: false,
        media_url: media?.url || null,
        media_type: media?.type || null,
        sender_id: profile?.id || null,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('whatsapp_messages')
        .insert([newMessage]);
        
      if (error) throw error;
      
      // Adicionar a mensagem à lista localmente
      setMessages(prev => [...prev, convertMessageFormat(newMessage)]);
      
      if (handleRefresh) handleRefresh();
      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Falha ao enviar mensagem");
      return false;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mensagens WhatsApp</h1>
          {pendingNotifications > 0 && (
            <p className="text-red-500 mt-1">
              {pendingNotifications} {pendingNotifications === 1 ? 'contato aguardando' : 'contatos aguardando'} atendimento
            </p>
          )}
        </div>
      </div>

      <Card className="grid grid-cols-1 md:grid-cols-3 h-[75vh] overflow-hidden">
        <div className="col-span-1">
          <LeadsList 
            selectedLeadId={selectedLead?.id || null}
            onSelectLead={handleSelectLead}
            onRefreshRequested={handleRefresh}
          />
        </div>
        <div className="col-span-2">
          <WhatsAppChat 
            messages={messages} 
            isLoading={messagesLoading}
            onSendMessage={handleSendMessage}
            selectedLead={selectedLead}
            onMessageSent={handleRefresh}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminWhatsAppMessages;
