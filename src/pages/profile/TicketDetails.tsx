
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/hooks/auth/auth-context';
import { TicketDetails as TicketDetailsComponent } from '@/components/support/TicketDetails';
import LoadingState from '@/components/support/ticket-details/LoadingState';
import NotFoundState from '@/components/support/ticket-details/NotFoundState';

// Interface de mensagem do ticket
interface TicketMessage {
  id: string;
  message: string;
  created_at: string;
  user: {
    full_name: string;
    is_admin: boolean;
  };
}

// Interface para ticket formatado
interface FormattedTicket {
  id: string;
  number: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  messages: TicketMessage[];
}

const ProfileTicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuthContext();
  const navigate = useNavigate();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      if (!id || !profile?.id) return null;
      
      try {
        // Buscar o ticket básico
        const { data: ticketData, error: ticketError } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('id', id)
          .eq('customer_id', profile.id)
          .single();
          
        if (ticketError) {
          console.error('Erro ao buscar ticket:', ticketError);
          return null;
        }
        
        // Buscar mensagens relacionadas - correção da tabela para ticket_messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('ticket_messages')
          .select('*')
          .eq('ticket_id', id)
          .order('created_at', { ascending: true });
          
        if (messagesError) {
          console.error('Erro ao buscar mensagens do ticket:', messagesError);
          return {
            ...ticketData,
            number: parseInt(ticketData.id.substring(0, 8), 16) % 10000, // Adicionando número
            messages: []
          } as FormattedTicket;
        }
        
        // Adaptar a estrutura do ticket para o formato esperado pelo componente
        // Criar um número sequencial para o ticket se não existir
        const ticketNumber = parseInt(ticketData.id.substring(0, 8), 16) % 10000;
        
        // Formatar as mensagens para atender à interface esperada
        const messages: TicketMessage[] = Array.isArray(messagesData) 
          ? messagesData.map((msg: any) => ({
              id: msg.id,
              message: msg.message,
              created_at: msg.created_at,
              user: {
                full_name: msg.is_from_customer ? profile.full_name : 'Atendente',
                is_admin: !msg.is_from_customer
              }
            }))
          : [];
        
        return {
          id: ticketData.id,
          number: ticketNumber,
          subject: ticketData.subject,
          description: ticketData.description,
          status: ticketData.status,
          priority: ticketData.priority,
          created_at: ticketData.created_at,
          messages
        } as FormattedTicket;
      } catch (error) {
        console.error('Erro ao processar dados do ticket:', error);
        return null;
      }
    },
    enabled: !!id && !!profile?.id
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!ticket) {
    return <NotFoundState />;
  }

  return <TicketDetailsComponent ticket={ticket} messages={ticket.messages} />;
};

export default ProfileTicketDetails;
