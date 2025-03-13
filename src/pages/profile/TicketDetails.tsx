
import React from 'react';
import { useParams } from 'react-router-dom';
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

const ProfileTicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuthContext();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      if (!id || !profile?.id) return null;
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          support_messages(*)
        `)
        .eq('id', id)
        .eq('customer_id', profile.id)
        .single();
        
      if (error) {
        console.error('Erro ao buscar ticket:', error);
        return null;
      }
      
      // Adaptar a estrutura do ticket para o formato esperado pelo componente
      if (data) {
        // Criar um número sequencial para o ticket se não existir
        const ticketNumber = parseInt(data.id.substring(0, 8), 16) % 10000;
        
        // Formatar as mensagens para atender à interface esperada
        const messages: TicketMessage[] = Array.isArray(data.support_messages) 
          ? data.support_messages.map((msg: any) => ({
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
          id: data.id,
          number: ticketNumber,
          subject: data.subject,
          description: data.description,
          status: data.status,
          priority: data.priority,
          created_at: data.created_at,
          messages
        };
      }
      
      return null;
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
