
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadInfoProps {
  lead: any;
}

export const LeadInfo = ({ lead }: LeadInfoProps) => {
  return (
    <div className="space-y-2">
      <Label>Informações do Lead</Label>
      <div className="text-sm space-y-1 text-gray-500">
        <p>Criado em: {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        {lead.last_interaction && (
          <p>Último contato: {format(new Date(lead.last_interaction), "dd/MM/yyyy", { locale: ptBR })}</p>
        )}
      </div>
    </div>
  );
};
