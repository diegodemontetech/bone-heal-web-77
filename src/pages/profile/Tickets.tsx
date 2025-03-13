
import React from 'react';
import { useAuthContext } from '@/hooks/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import TicketList from '@/components/support/TicketList';
import CreateTicketDialog from '@/components/support/tickets/CreateTicketDialog';
import EmptyTicketsState from '@/components/support/tickets/EmptyTicketsState';
import TicketsHeader from '@/components/support/tickets/TicketsHeader';
import TicketStatusTabs from '@/components/support/tickets/TicketStatusTabs';

const ProfileTickets = () => {
  const { profile } = useAuthContext();
  const [activeTab, setActiveTab] = React.useState('all');

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets', profile?.id, activeTab],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      let query = supabase
        .from('support_tickets')
        .select('*')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meus Chamados</CardTitle>
          <CreateTicketDialog />
        </CardHeader>
        <CardContent>
          <TicketsHeader />
          
          <TicketStatusTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {!isLoading && tickets && tickets.length > 0 ? (
            <TicketList tickets={tickets} />
          ) : (
            <EmptyTicketsState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTickets;
