
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { Lead } from "@/types/leads";

interface LeadRowProps {
  lead: Lead;
  onUpdateStatus: (leadId: string, status: string) => void;
  onConvertToCRM: (lead: Lead) => void;
}

const LeadRow = ({ lead, onUpdateStatus, onConvertToCRM }: LeadRowProps) => {
  return (
    <TableRow key={lead.id}>
      <TableCell className="font-medium">
        {format(new Date(lead.created_at), "dd/MM/yyyy", {
          locale: ptBR,
        })}
        <div className="text-xs text-gray-500">
          {format(new Date(lead.created_at), "HH:mm", {
            locale: ptBR,
          })}
        </div>
      </TableCell>
      <TableCell>{lead.name}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            <span>{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-1 mt-1">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm">{lead.email}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          lead.source === "whatsapp_widget" 
            ? "bg-green-100 text-green-800" 
            : "bg-blue-100 text-blue-800"
        }`}>
          {lead.source === "whatsapp_widget" ? "WhatsApp" : "Formulário"}
        </span>
      </TableCell>
      <TableCell>{lead.reason}</TableCell>
      <TableCell>
        <Select
          value={lead.status}
          onValueChange={(value) => onUpdateStatus(lead.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Novo</SelectItem>
            <SelectItem value="contacted">Contatado</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // View message and details
              toast(`Mensagem: ${lead.message || 'Não informada'}`, {
                description: `Lead criado em ${format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}`,
                duration: 5000,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onConvertToCRM(lead)}
          >
            Converter para CRM
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LeadRow;
