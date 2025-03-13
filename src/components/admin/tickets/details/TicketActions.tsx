
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Check, UserCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TicketActionsProps {
  ticket: any;
  agents: any[];
  onStatusChange: (status: string) => Promise<void>;
  onAssign: (agentId: string) => Promise<void>;
}

const TicketActions = ({ ticket, agents, onStatusChange, onAssign }: TicketActionsProps) => {
  const statusOptions = [
    { value: "open", label: "Aberto" },
    { value: "in_progress", label: "Em Andamento" },
    { value: "resolved", label: "Resolvido" },
    { value: "closed", label: "Fechado" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações do Chamado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Atualizar Status</Label>
              <Select
                value={ticket.status}
                onValueChange={(value) => onStatusChange(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={ticket.status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(option.value)}
                  disabled={ticket.status === option.value}
                  className="flex items-center"
                >
                  {ticket.status === option.value && <Check className="w-4 h-4 mr-1" />}
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Separator className="sm:hidden mb-4" />
            
            <div className="space-y-2">
              <Label htmlFor="agent">Atribuir para Agente</Label>
              <Select
                value={ticket.assigned_to || ""}
                onValueChange={(value) => onAssign(value)}
              >
                <SelectTrigger id="agent" className="w-full">
                  <SelectValue placeholder="Selecione um agente" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {agents.slice(0, 6).map((agent) => (
                <Button
                  key={agent.id}
                  variant={ticket.assigned_to === agent.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onAssign(agent.id)}
                  disabled={ticket.assigned_to === agent.id}
                  className="flex items-center justify-center"
                >
                  <UserCircle2 className="w-4 h-4 mr-1" />
                  <span className="truncate">{agent.full_name.split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketActions;
