
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { useAuth } from "@/hooks/use-auth-context";
import CreateTicketDialog from "@/components/admin/tickets/CreateTicketDialog";
import TicketsContent from "@/components/admin/tickets/TicketsContent";

const AdminTickets = () => {
  const { profile, isAdminMaster, hasPermission } = useAuth();

  console.log("Auth no Tickets:", { profile, isAdminMaster, hasPermission });

  // Buscar tickets com filtros
  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          customer:customer_id(full_name, email),
          assigned:assigned_to(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("is_admin", true);

      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
          <CreateTicketDialog onSuccess={refetch} />
        </div>

        <TicketsContent 
          tickets={tickets} 
          isLoading={isLoading} 
          agents={agents} 
        />
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;
