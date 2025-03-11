
import { Droppable } from "@hello-pangea/dnd";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface OrderKanbanColumnProps {
  id: string;
  title: string;
  icon: LucideIcon;
  count: number;
  children: ReactNode;
}

const OrderKanbanColumn = ({ id, title, icon: Icon, count, children }: OrderKanbanColumnProps) => {
  return (
    <div key={id} className="flex flex-col">
      <div className="flex items-center gap-2 mb-3 p-2 bg-gray-100 rounded">
        <Icon className="w-4 h-4" />
        <h3 className="font-semibold">{title}</h3>
        <span className="ml-auto bg-gray-200 px-2 py-0.5 rounded text-sm">
          {count}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 min-h-[500px]"
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default OrderKanbanColumn;
