
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Headset, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const TicketsSection = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: "",
    description: "",
    priority: "medium"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setTicketData(prev => ({ ...prev, priority: value }));
  };

  const handleCreateTicket = async () => {
    if (!ticketData.subject || !ticketData.description) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setIsCreating(true);

      const { data, error } = await supabase
        .from("support_tickets")
        .insert({
          customer_id: profile?.id,
          subject: ticketData.subject,
          description: ticketData.description,
          priority: ticketData.priority,
          status: "open"
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Chamado criado com sucesso!");
      setIsDialogOpen(false);
      setTicketData({
        subject: "",
        description: "",
        priority: "medium"
      });
      
      // Redirecionar para a página de detalhes do chamado
      navigate(`/support/tickets/${data.id}`);
    } catch (error: any) {
      console.error("Erro ao criar chamado:", error);
      toast.error("Erro ao criar chamado: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Suporte</h2>
      <p className="text-sm text-muted-foreground">
        Acompanhe seus chamados de suporte ou abra um novo chamado.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => navigate("/support/tickets")}
          variant="outline"
        >
          <Headset className="w-4 h-4 mr-2" />
          Meus Chamados
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Abrir Chamado
            </Button>
          </DialogTrigger>
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
                  onChange={handleInputChange}
                  placeholder="Assunto do chamado"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select 
                  value={ticketData.priority} 
                  onValueChange={handlePriorityChange}
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
                  onChange={handleInputChange}
                  placeholder="Descreva seu problema em detalhes"
                  rows={5}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateTicket}
                  disabled={isCreating || !ticketData.subject || !ticketData.description}
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
      </div>
    </div>
  );
};
