
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Headset, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";
import CreateTicketDialog from "@/components/support/tickets/CreateTicketDialog";
import { supabase } from "@/integrations/supabase/client";
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
        
        <Button 
          variant="default"
          onClick={() => setIsDialogOpen(true)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Abrir Chamado
        </Button>
      </div>

      <CreateTicketDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateTicket={handleCreateTicket}
        isCreating={isCreating}
        ticketData={ticketData}
        onInputChange={handleInputChange}
        onPriorityChange={handlePriorityChange}
      />
    </div>
  );
};
