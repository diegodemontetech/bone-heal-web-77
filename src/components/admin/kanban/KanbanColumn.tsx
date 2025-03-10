
import { ReactNode } from "react";
import { Droppable } from "@hello-pangea/dnd";

interface KanbanColumnProps {
  id: string;
  title: string;
  children: ReactNode;
  totalCards: number;
}

export const KanbanColumn = ({ id, title, children, totalCards }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col bg-gray-100 p-3 rounded-lg h-[70vh]">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-medium">{title}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
          {totalCards}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto pr-1 pb-2"
            style={{ minHeight: "100px" }}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
