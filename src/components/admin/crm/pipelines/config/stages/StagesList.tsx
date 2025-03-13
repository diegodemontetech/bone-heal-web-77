
import { CRMStage } from "@/types/crm";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { StageItem } from "./StageItem";

interface StagesListProps {
  stages: CRMStage[];
  onDragEnd: (result: DropResult) => void;
  onUpdateStage: (stage: CRMStage, field: string, value: string) => void;
  onDeleteStage: (stageId: string) => void;
}

export const StagesList = ({ 
  stages, 
  onDragEnd, 
  onUpdateStage, 
  onDeleteStage 
}: StagesListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="stages-list">
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {stages.map((stage, index) => (
              <Draggable key={stage.id} draggableId={stage.id} index={index}>
                {(provided) => (
                  <StageItem
                    stage={stage}
                    provided={provided}
                    onUpdate={onUpdateStage}
                    onDelete={onDeleteStage}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
