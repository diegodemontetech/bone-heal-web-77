
import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanColumn } from "./KanbanColumn";
import { LeadDrawer } from "./LeadDrawer";
import { useContactsQuery } from "./hooks/useContactsQuery";
import { usePipelineQuery } from "./hooks/usePipelineQuery";
import { useUpdateLeadStatus } from "./hooks/useUpdateLeadStatus";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

interface CRMKanbanProps {
  defaultPipelineId?: string;
}

const CRMKanban = ({ defaultPipelineId }: CRMKanbanProps) => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(defaultPipelineId || null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Fetch available pipelines
  const { data: pipelines, isLoading: pipelinesLoading } = useQuery({
    queryKey: ["pipelines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_pipelines")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Initialize defaultPipelineId when pipelines are loaded
  useEffect(() => {
    if (!selectedPipelineId && pipelines && pipelines.length > 0) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId]);

  const { pipeline, stages, isLoading: pipelineLoading } = usePipelineQuery(selectedPipelineId);
  const { contacts, isLoading: contactsLoading, refetch: refetchContacts } = useContactsQuery(selectedPipelineId);
  const { updateLeadStatus } = useUpdateLeadStatus();

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const handleStageChange = async (leadId: string, newStageId: string) => {
    try {
      await updateLeadStatus(leadId, newStageId);
      refetchContacts();
      toast.success("Contato movido com sucesso!");
    } catch (error) {
      console.error("Erro ao mover contato:", error);
      toast.error("Erro ao mover contato");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;

    // Se não houver destino ou o item for solto na mesma coluna e posição
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Atualizar o estágio do lead com base na coluna de destino
    try {
      await updateLeadStatus(draggableId, destination.droppableId);
      refetchContacts();
      toast.success("Contato movido com sucesso!");
    } catch (error) {
      console.error("Erro ao mover contato:", error);
      toast.error("Erro ao mover contato");
    }
  };

  // Adicionar novo contato
  const handleAddNewContact = () => {
    if (!selectedPipelineId || stages.length === 0) {
      toast.error("Selecione um pipeline primeiro");
      return;
    }
    
    // Criar um contato vazio e abrir o drawer para edição
    const firstStageId = stages[0].id;
    const newContact = {
      id: "",
      pipeline_id: selectedPipelineId,
      stage_id: firstStageId,
      full_name: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stage: stages[0]
    };
    
    setSelectedLead(newContact);
    setDrawerOpen(true);
  };

  // Organizar contacts por estágio
  const contactsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = contacts.filter(contact => contact.stage_id === stage.id);
    return acc;
  }, {} as Record<string, any[]>);

  if (pipelinesLoading || pipelineLoading || contactsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {pipeline ? pipeline.name : "CRM Kanban"}
        </h1>
        
        <div className="flex gap-4">
          <Button 
            variant="default" 
            onClick={handleAddNewContact}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Novo Contato
          </Button>
          
          <Select
            value={selectedPipelineId || ""}
            onValueChange={(value) => setSelectedPipelineId(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar Pipeline" />
            </SelectTrigger>
            <SelectContent>
              {pipelines?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {stages.map((stage) => (
            <KanbanColumn 
              key={stage.id}
              id={stage.id}
              title={stage.name} 
              color={stage.color}
              leads={contactsByStage[stage.id] || []} 
              onLeadClick={handleLeadClick}
              onStatusChange={handleStageChange}
            />
          ))}
        </div>
      </DragDropContext>

      <LeadDrawer 
        lead={selectedLead} 
        open={drawerOpen} 
        onClose={() => {
          setDrawerOpen(false);
          refetchContacts();
        }}
        onStatusChange={handleStageChange}
        onLeadUpdated={refetchContacts}
        stages={stages}
      />
    </div>
  );
};

export default CRMKanban;
