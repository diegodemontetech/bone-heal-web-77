
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import TicketCategorySelect from "./TicketCategorySelect";

interface CreateTicketDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTicket: () => Promise<void>;
  isCreating: boolean;
  ticketData: {
    subject: string;
    description: string;
    priority: string;
    category: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPriorityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const CreateTicketDialog = ({
  isOpen,
  onOpenChange,
  onCreateTicket,
  isCreating,
  ticketData,
  onInputChange,
  onPriorityChange,
  onCategoryChange
}: CreateTicketDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Chamado de Suporte</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              name="subject"
              value={ticketData.subject}
              onChange={onInputChange}
              placeholder="Assunto do chamado"
            />
          </div>
          
          <TicketCategorySelect 
            value={ticketData.category} 
            onValueChange={onCategoryChange} 
          />
          
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select 
              value={ticketData.priority} 
              onValueChange={onPriorityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={ticketData.description}
              onChange={onInputChange}
              placeholder="Descreva seu problema em detalhes"
              rows={5}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={onCreateTicket}
              disabled={isCreating || !ticketData.subject || !ticketData.description || !ticketData.category}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Chamado
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
