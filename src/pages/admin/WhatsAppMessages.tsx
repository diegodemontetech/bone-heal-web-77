
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import LeadsList from '@/components/admin/whatsapp/LeadsList';
import WhatsAppChat from '@/components/admin/whatsapp/WhatsAppChat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AdminWhatsAppMessages = () => {
  const { profile, hasPermission } = useAuth();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [pendingNotifications, setPendingNotifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

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
      supabase.removeChannel(subscription);
    };
  }, [profile]);

  const fetchNotifications = async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
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
  };
  
  const handleRefresh = () => {
    fetchNotifications();
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
            selectedLead={selectedLead} 
            onMessageSent={handleRefresh}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminWhatsAppMessages;
