
import { Card, CardContent } from "@/components/ui/card";
import { Lead } from "@/types/crm";
import { Draggable } from "@hello-pangea/dnd";

interface LeadCardProps {
  lead: Lead;
  index: number;
}

const LeadCard = ({ lead, index }: LeadCardProps) => {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-2 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <h3 className="font-medium">{lead.name}</h3>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              <p className="text-sm">{lead.phone}</p>
              <div className="flex mt-2 text-xs">
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1">
                  {lead.source}
                </span>
                {lead.needs_human && (
                  <span className="bg-red-100 text-red-600 rounded-full px-2 py-1 ml-1">
                    Atenção
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default LeadCard;
