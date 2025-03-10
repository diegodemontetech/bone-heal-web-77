
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketsList from "./TicketsList";
import TicketFilters from "./TicketFilters";

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

interface TicketsContentProps {
  tickets: any[] | null;
  isLoading: boolean;
  agents: any[] | null;
}

const TicketsContent = ({ tickets, isLoading, agents }: TicketsContentProps) => {
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);

  const handleResetFilters = () => {
    setStatus(null);
    setPriority(null);
    setAssignedTo(null);
  };

  // Aplicar filtros na interface (já que os dados vêm filtrados do componente pai)
  const filteredTickets = tickets?.filter(ticket => {
    let isMatched = true;
    
    if (status && ticket.status !== status) {
      isMatched = false;
    }
    
    if (priority && ticket.priority !== priority) {
      isMatched = false;
    }
    
    if (assignedTo) {
      if (assignedTo === "unassigned" && ticket.assigned_to !== null) {
        isMatched = false;
      } else if (assignedTo !== "unassigned" && ticket.assigned_to !== assignedTo) {
        isMatched = false;
      }
    }
    
    return isMatched;
  });

  return (
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
              tickets={filteredTickets} 
              isLoading={isLoading}
              categoryLabels={{
                status: statusOptions,
                priority: priorityOptions
              }}
            />
          </TabsContent>
          
          <TabsContent value="open">
            <TicketsList 
              tickets={filteredTickets?.filter(t => t.status === 'open')} 
              isLoading={isLoading}
              categoryLabels={{
                status: statusOptions,
                priority: priorityOptions
              }}
            />
          </TabsContent>
          
          <TabsContent value="in_progress">
            <TicketsList 
              tickets={filteredTickets?.filter(t => t.status === 'in_progress')} 
              isLoading={isLoading}
              categoryLabels={{
                status: statusOptions,
                priority: priorityOptions
              }}
            />
          </TabsContent>
          
          <TabsContent value="resolved">
            <TicketsList 
              tickets={filteredTickets?.filter(t => t.status === 'resolved' || t.status === 'closed')} 
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
  );
};

export default TicketsContent;
