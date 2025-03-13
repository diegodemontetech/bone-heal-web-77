
import { CRMStage, Lead } from "@/types/crm";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import KanbanColumn from "../KanbanColumn";
import LeadCard from "../LeadCard";
import { toast } from "sonner";

interface KanbanBoardProps {
  stages: CRMStage[];
  groupedLeads: Record<string, Lead[]>;
  onLeadMove: (
    draggableId: string, 
    sourceId: string, 
    destinationId: string, 
    destinationIndex: number
  ) => void;
}

const KanbanBoard = ({ 
  stages, 
  groupedLeads, 
  onLeadMove 
}: KanbanBoardProps) => {
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Se não houver destino ou se o destino for o mesmo que a origem, não fazer nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Se o destino for diferente da origem, mover o lead para o novo estágio
    if (destination.droppableId !== source.droppableId) {
      try {
        onLeadMove(
          draggableId, 
          source.droppableId, 
          destination.droppableId, 
          destination.index
        );
      } catch (error) {
        console.error("Erro ao mover lead:", error);
        toast.error("Erro ao mover lead. Tente novamente.");
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <KanbanColumn 
            key={stage.id}
            id={stage.id}
            title={stage.name}
            count={groupedLeads[stage.id]?.length || 0}
            color={stage.color}
          >
            {groupedLeads[stage.id]?.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
