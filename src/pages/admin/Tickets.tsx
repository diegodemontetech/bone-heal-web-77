
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TicketsList from "@/components/admin/tickets/TicketsList";
import TicketFilters from "@/components/admin/tickets/TicketFilters";
import { useAuth } from "@/hooks/use-auth-context";

const statusOptions = {
  open: "Aberto",
  in_progress: "Em Andamento",
  resolved: "Resolvido",
  closed: "Fechado"
};

const priorityOptions = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
  urgent: "Urgente"
};

const AdminTickets = () => {
  const { profile, isAdminMaster, hasPermission } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);

  console.log("Auth no Tickets:", { profile, isAdminMaster, hasPermission });

  // Buscar tickets com filtros
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["tickets", status, priority, assignedTo],
    queryFn: async () => {
      let query = supabase
        .from("support_tickets")
        .select(`
          *,
          customer:customer_id(full_name, email),
          assigned:assigned_to(full_name)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      if (priority) {
        query = query.eq("priority", priority);
      }

      if (assignedTo) {
        if (assignedTo === "unassigned") {
          query = query.is("assigned_to", null);
        } else {
          query = query.eq("assigned_to", assignedTo);
        }
      }

      const { data, error } = await query;

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

  const handleResetFilters = () => {
    setStatus(null);
    setPriority(null);
    setAssignedTo(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Ticket
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciamento de Tickets</CardTitle>
          <CardDescription>
            Gerencie e acompanhe os chamados de suporte dos clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="open">Abertos</TabsTrigger>
                <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
                <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
              </TabsList>
            </div>

            <TicketFilters
              statusOptions={statusOptions}
              priorityOptions={priorityOptions}
              agents={agents || []}
              selectedStatus={status}
              selectedPriority={priority}
              selectedAgent={assignedTo}
              onStatusChange={setStatus}
              onPriorityChange={setPriority}
              onAgentChange={setAssignedTo}
              onReset={handleResetFilters}
            />

            <TabsContent value="all">
              <TicketsList 
                tickets={tickets} 
                isLoading={isLoading} 
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
            
            <TabsContent value="open">
              <TicketsList 
                tickets={tickets?.filter(t => t.status === 'open')} 
                isLoading={isLoading}
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
            
            <TabsContent value="in_progress">
              <TicketsList 
                tickets={tickets?.filter(t => t.status === 'in_progress')} 
                isLoading={isLoading}
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
            
            <TabsContent value="resolved">
              <TicketsList 
                tickets={tickets?.filter(t => t.status === 'resolved' || t.status === 'closed')} 
                isLoading={isLoading}
                categoryLabels={{
                  status: statusOptions,
                  priority: priorityOptions
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTickets;
