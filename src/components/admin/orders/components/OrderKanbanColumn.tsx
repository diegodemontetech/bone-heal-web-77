
import { Droppable } from "@hello-pangea/dnd";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface OrderKanbanColumnProps {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  count: number;
  children: ReactNode;
}

const OrderKanbanColumn = ({ id, title, icon: Icon, color, count, children }: OrderKanbanColumnProps) => {
  return (
    <div key={id} className="flex flex-col h-full">
      <div className={`flex items-center gap-2 mb-3 p-3 rounded-lg ${color} shadow-sm`}>
        <Icon className="w-5 h-5" />
        <h3 className="font-semibold">{title}</h3>
        <span className="ml-auto bg-white bg-opacity-90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-sm font-medium shadow-sm">
          {count}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 min-h-[600px] bg-slate-50/50 rounded-lg p-2.5 overflow-y-auto shadow-inner"
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
