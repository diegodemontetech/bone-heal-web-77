
import { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from 'sonner';

interface WhatsAppChatProps {
  selectedLead: any;
  onMessageSent: () => void;
}

const WhatsAppChat = ({ selectedLead, onMessageSent }: WhatsAppChatProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  useEffect(() => {
    if (selectedLead?.id) {
      fetchMessages();
      
      // Atualizar status do lead para visualizado
      updateLeadStatus();
      
      // Inscrever-se para atualizações em tempo real
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
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
  
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    try {
      // Enviar mensagem via Edge Function
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: selectedLead.phone,
          message: message.trim(),
          name: selectedLead.name,
          isAgent: true,
          agentId: profile?.id
        }
      });
      
      if (error) throw error;
      
      setMessage('');
      onMessageSent();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (!selectedLead) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-muted-foreground">Selecione um contato para iniciar a conversa</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : 'C'}
          </div>
        </Avatar>
        <div>
          <h3 className="font-medium">{selectedLead.name || 'Cliente'}</h3>
          <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
        </div>
      </div>
      
      {/* Conteúdo das mensagens */}
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma mensagem disponível.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={msg.id || index}
                className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.direction === 'outbound' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  <div className={`text-xs mt-1 ${msg.direction === 'outbound' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {msg.created_at && formatDistanceToNow(new Date(msg.created_at), { 
                      addSuffix: true,
                      locale: ptBR
                    })}
                    {msg.sent_by === 'agente' && ' • Enviado por atendente'}
                    {msg.sent_by === 'bot' && ' • Enviado por bot'}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Entrada de mensagem */}
      <div className="p-4 border-t flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <Button 
          onClick={sendMessage} 
          disabled={sending || !message.trim()}
          type="button"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppChat;
