
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TicketFilters from "@/components/admin/tickets/TicketFilters";
import TicketsList from "@/components/admin/tickets/TicketsList";

const categoryLabels: Record<string, string> = {
  "technical": "Suporte Técnico",
  "financial": "Financeiro",
  "product": "Dúvida sobre Produto",
  "order": "Pedido",
  "other": "Outro"
};

const AdminTickets = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin-tickets", statusFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          customer:customer_id(full_name, email),
          ticket_messages(id)
        `)
        .order('created_at', { ascending: false });
      
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      if (searchQuery) {
        query = query.or(`subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tickets de Suporte</h1>
      
      <TicketFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <TicketsList 
        tickets={tickets} 
        isLoading={isLoading} 
        categoryLabels={categoryLabels} 
      />
    </div>
  );
};

export default AdminTickets;
