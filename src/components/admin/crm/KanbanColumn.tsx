
import { Stage, Contact } from "@/types/crm";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KanbanColumnProps {
  stage: Stage;
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
}

export const KanbanColumn = ({ stage, contacts, onContactClick }: KanbanColumnProps) => {
  return (
    <div className="w-80 flex-shrink-0">
      <Card className="h-full flex flex-col">
        <CardHeader className="py-3 px-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: stage.color }}
              ></span>
              {stage.name}
            </CardTitle>
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-1">
              {contacts.length}
            </span>
          </div>
        </CardHeader>
        <Droppable droppableId={stage.id}>
          {(provided) => (
            <CardContent
              className="flex-1 p-2 overflow-y-auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-md">
                  Sem contatos neste estágio
                </div>
              ) : (
                contacts.map((contact, index) => (
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
                        className="mb-2"
                      >
                        <Card
                          className="p-3 cursor-pointer hover:bg-muted/50"
                          onClick={() => onContactClick(contact)}
                        >
                          <div className="font-medium text-sm">
                            {contact.full_name}
                          </div>
                          {contact.email && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {contact.email}
                            </div>
                          )}
                          {contact.whatsapp && (
                            <div className="text-xs text-muted-foreground truncate">
                              {contact.whatsapp}
                            </div>
                          )}
                          {contact.last_interaction && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                              <span>Última interação:</span>
                              <span>
                                {format(new Date(contact.last_interaction), "dd/MM/yyyy", {
                                  locale: ptBR,
                                })}
                              </span>
                            </div>
                          )}
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </CardContent>
          )}
        </Droppable>
      </Card>
    </div>
  );
};
