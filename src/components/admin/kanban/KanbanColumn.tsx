
import { ReactNode } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import { MapPin, Phone, User } from "lucide-react";

// Interface for the lead card props
interface LeadCardProps {
  lead: any;
  index: number;
  onClick: (lead: any) => void;
}

// Improved component for the lead card
const LeadCard = ({ lead, index, onClick }: LeadCardProps) => {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-md mb-3 shadow hover:shadow-md transition-all cursor-pointer border border-gray-100"
          onClick={() => onClick(lead)}
        >
          <h4 className="font-medium text-base mb-2 truncate">{lead.full_name}</h4>
          
          <div className="space-y-2 text-sm">
            {/* Location info with icon */}
            {(lead.city || lead.state) && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {[lead.city, lead.state].filter(Boolean).join(" - ")}
                </span>
              </div>
            )}
            
            {/* Phone info with icon */}
            {lead.whatsapp && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{lead.whatsapp}</span>
              </div>
            )}
            
            {/* Responsible user/salesperson with icon */}
            {lead.responsible_id && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {lead.responsible?.full_name || "Sem responsável"}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
            {lead.clinic_name ? (
              <span className="px-2 py-1 bg-gray-50 text-xs rounded-full text-gray-600 font-medium">
                {lead.clinic_name}
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-50 text-xs rounded-full text-gray-500">
                {lead.client_type || "Cliente"}
              </span>
            )}
            <span className="text-xs text-gray-400">
              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

// Interface for the Kanban column
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
    <div className="flex flex-col bg-gray-50 rounded-lg p-3 h-[70vh]">
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
          {leads.length}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto pr-1 pb-2 space-y-1"
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
