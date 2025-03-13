
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/hooks/auth/auth-context';
import { TicketDetails as TicketDetailsComponent } from '@/components/support/TicketDetails';
import LoadingState from '@/components/support/ticket-details/LoadingState';
import NotFoundState from '@/components/support/ticket-details/NotFoundState';

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
      
      return data;
    },
    enabled: !!id && !!profile?.id
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!ticket) {
    return <NotFoundState />;
  }

  return <TicketDetailsComponent ticket={ticket} />;
};

export default ProfileTicketDetails;
