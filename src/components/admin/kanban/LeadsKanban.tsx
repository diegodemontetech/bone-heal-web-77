
import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanColumn } from "./KanbanColumn";
import { LeadDrawer } from "./LeadDrawer";
import { useLeadsQuery } from "./hooks/useLeadsQuery";
import { useUpdateLeadStatus } from "./hooks/useUpdateLeadStatus";

const LeadsKanban = () => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const { leads, isLoading, refetch } = useLeadsQuery(filter);
  const { updateLeadStatus } = useUpdateLeadStatus();

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await updateLeadStatus(leadId, newStatus);
    refetch();
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;

    // Se não houver destino ou o item for solto na mesma coluna e posição
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Atualizar o status do lead com base na coluna de destino
    await updateLeadStatus(draggableId, destination.droppableId);
    refetch();
  };

  // Organizar leads por status
  const newLeads = leads?.filter(lead => lead.status === 'new') || [];
  const contactedLeads = leads?.filter(lead => lead.status === 'contacted') || [];
  const closedLeads = leads?.filter(lead => lead.status === 'closed') || [];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kanban de Leads</h1>
        <Select
          value={filter || "all"}
          onValueChange={(value) => setFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="whatsapp_widget">WhatsApp</SelectItem>
            <SelectItem value="contact_form">Formulário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn 
            id="new"
            title="Novos" 
            color="#3b82f6" // Added the color property
            leads={newLeads} 
            onLeadClick={handleLeadClick}
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn 
            id="contacted"
            title="Contatados" 
            color="#10b981" // Added the color property
            leads={contactedLeads} 
            onLeadClick={handleLeadClick}
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn 
            id="closed"
            title="Fechados" 
            color="#ef4444" // Added the color property
            leads={closedLeads} 
            onLeadClick={handleLeadClick}
            onStatusChange={handleStatusChange}
          />
        </div>
      </DragDropContext>

      <LeadDrawer 
        lead={selectedLead} 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onLeadUpdated={refetch}
      />
    </div>
  );
};

export default LeadsKanban;
