
import { CRMStage } from "@/types/crm";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { StageItem } from "./StageItem";

interface StagesListProps {
  stages: CRMStage[];
  onEdit: (stage: CRMStage) => void;
  onDelete: (stageId: string) => void;
  onDragEnd?: (result: DropResult) => void;
  onUpdate?: (stage: CRMStage, field: string, value: string) => void;
}

export const StagesList = ({ 
  stages, 
  onEdit, 
  onDelete,
  onDragEnd,
  onUpdate 
}: StagesListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onDragEnd) return;
    onDragEnd(result);
  };

  const handleUpdate = (stage: CRMStage, field: string, value: string) => {
    if (onUpdate) {
      onUpdate(stage, field, value);
    } else {
      console.log("Update stage", stage.id, field, value);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
                    onUpdate={handleUpdate}
                    onDelete={onDelete}
                    onEdit={onEdit}
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
