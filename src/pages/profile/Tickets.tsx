
import React, { useState } from 'react';
import { useAuthContext } from '@/hooks/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TicketList } from '@/components/support/TicketList';
import CreateTicketDialog from '@/components/support/tickets/CreateTicketDialog';
import EmptyTicketsState from '@/components/support/tickets/EmptyTicketsState';
import TicketsHeader from '@/components/support/tickets/TicketsHeader';
import TicketStatusTabs from '@/components/support/tickets/TicketStatusTabs';
import { toast } from 'sonner';

// Interface para o ticket no formato esperado pelo componente TicketList
interface Ticket {
  id: string;
  number: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  ticket_messages: { id: string }[];
}

const ProfileTickets = () => {
  const { profile } = useAuthContext();
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "support"
  });

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['tickets', profile?.id, activeTab],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      let query = supabase
        .from('support_tickets')
        .select('*, ticket_messages(*)')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transformar os dados para o formato esperado pelo componente TicketList
      return (data || []).map((ticket): Ticket => {
        // Gerar um número sequencial baseado no ID para usar como número do ticket
        const ticketNumber = parseInt(ticket.id.substring(0, 8), 16) % 10000;
        
        return {
          id: ticket.id,
          number: ticketNumber,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          created_at: ticket.created_at,
          ticket_messages: ticket.ticket_messages || []
        };
      });
    },
    enabled: !!profile?.id
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleCreateTicket = async () => {
    if (!ticketData.subject || !ticketData.description) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsCreating(true);
    try {
      await supabase.from('support_tickets').insert({
        customer_id: profile?.id,
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority,
        category: ticketData.category,
        status: 'open'
      });
      
      toast.success("Chamado criado com sucesso!");
      setIsDialogOpen(false);
      setTicketData({
        subject: "",
        description: "",
        priority: "medium",
        category: "support"
      });
      refetch();
    } catch (error) {
      toast.error("Erro ao criar chamado");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setTicketData(prev => ({ ...prev, priority: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setTicketData(prev => ({ ...prev, category: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meus Chamados</CardTitle>
          <CreateTicketDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onCreateTicket={handleCreateTicket}
            isCreating={isCreating}
            ticketData={ticketData}
            onInputChange={handleInputChange}
            onPriorityChange={handlePriorityChange}
            onCategoryChange={handleCategoryChange}
          />
        </CardHeader>
        <CardContent>
          <TicketsHeader 
            onCreateTicket={() => setIsDialogOpen(true)} 
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
          
          <TicketStatusTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {!isLoading && tickets && tickets.length > 0 ? (
            <TicketList tickets={tickets} />
          ) : (
            <EmptyTicketsState 
              activeTab={activeTab} 
              onCreateTicket={() => setIsDialogOpen(true)} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTickets;
