
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, User, Calendar } from "lucide-react";

interface Contact {
  id: string;
  full_name: string;
  cro?: string;
  city?: string;
  state?: string;
  last_interaction: string;
  responsible_id?: string;
  [key: string]: any;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
}

export const KanbanColumn = ({ id, title, color, contacts, onContactClick }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col rounded-md shadow-sm bg-gray-50 h-[70vh] border border-gray-200">
      <div 
        className="px-4 py-3 font-medium flex justify-between items-center rounded-t-md"
        style={{ backgroundColor: `${color}20` }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0" 
            style={{ backgroundColor: color }}
          ></div>
          <span>{title}</span>
        </div>
        <span className="bg-white text-xs px-2 py-1 rounded-full text-gray-600 font-medium">
          {contacts.length}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto p-2 space-y-2"
          >
            {contacts.map((contact, index) => (
              <Draggable 
                key={contact.id} 
                draggableId={contact.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-3 rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => onContactClick(contact)}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">
                          {contact.full_name}
                        </h3>
                        {contact.cro && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            CRO: {contact.cro}
                          </span>
                        )}
                      </div>
                      
                      {(contact.city || contact.state) && (
                        <div className="flex items-center text-gray-500 text-xs gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {[contact.city, contact.state].filter(Boolean).join(' - ')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(contact.last_interaction), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                        
                        {contact.responsible_id && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">Resp.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {contacts.length === 0 && (
              <div className="flex items-center justify-center h-24 border border-dashed border-gray-200 rounded-md">
                <p className="text-sm text-gray-400">Nenhum contato</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
