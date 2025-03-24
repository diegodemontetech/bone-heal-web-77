
import { ReactNode } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";

// Interface para os cards de lead
interface LeadCardProps {
  lead: any;
  index: number;
  onClick: (lead: any) => void;
}

// Componente do card de lead
const LeadCard = ({ lead, index, onClick }: LeadCardProps) => {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded-md mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onClick(lead)}
        >
          <h4 className="font-medium mb-1 truncate">{lead.full_name}</h4>
          <p className="text-gray-500 text-sm truncate">{lead.phone}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {lead.clinic_name || "Sem clínica"}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

// Interface para a coluna Kanban
export interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  leads: any[];
  onLeadClick: (lead: any) => void;
  onStatusChange: (leadId: string, newStageId: string) => Promise<void>;
}

export const KanbanColumn = ({ id, title, color, leads, onLeadClick, onStatusChange }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col bg-gray-50 p-3 rounded-lg h-[70vh]">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: color }}
          />
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
          {leads.length}
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
            {leads.map((lead, index) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                index={index}
                onClick={onLeadClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
