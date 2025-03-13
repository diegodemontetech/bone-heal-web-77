
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, MessageSquare, Box, CreditCard, TruckIcon, HeadphonesIcon } from "lucide-react";
import CreateTicketDialog from "@/components/support/tickets/CreateTicketDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";

export const SupportButtonsSection = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ticketData, setTicketData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setTicketData(prev => ({ ...prev, priority: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setTicketData(prev => ({ ...prev, category: value }));
  };

  const openTicketDialogWithCategory = (category: string) => {
    setTicketData(prev => ({ ...prev, category }));
    setIsDialogOpen(true);
  };

  const handleCreateTicket = async () => {
    if (!ticketData.subject || !ticketData.description || !ticketData.category) {
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
          category: ticketData.category,
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
        priority: "medium",
        category: ""
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
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={() => navigate("/support/tickets")}
        variant="outline"
        className="flex items-center"
      >
        <HeadphonesIcon className="w-4 h-4 mr-2" />
        Meus Chamados
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Abrir Chamado
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => openTicketDialogWithCategory("support")}>
            <HeadphonesIcon className="w-4 h-4 mr-2" />
            Suporte Técnico
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openTicketDialogWithCategory("sales")}>
            <Box className="w-4 h-4 mr-2" />
            Vendas
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openTicketDialogWithCategory("logistics")}>
            <TruckIcon className="w-4 h-4 mr-2" />
            Entregas (Logística)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openTicketDialogWithCategory("financial")}>
            <CreditCard className="w-4 h-4 mr-2" />
            Financeiro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateTicketDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateTicket={handleCreateTicket}
        isCreating={isCreating}
        ticketData={ticketData}
        onInputChange={handleInputChange}
        onPriorityChange={handlePriorityChange}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
};
