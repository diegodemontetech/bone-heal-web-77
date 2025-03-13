
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import TicketsHeader from "@/components/support/tickets/TicketsHeader";
import TicketStatusTabs from "@/components/support/tickets/TicketStatusTabs";
import TicketsList from "@/components/support/tickets/TicketsList";
import CreateTicketDialog from "@/components/support/tickets/CreateTicketDialog";
import { getPriorityBadge, getStatusBadge } from "@/components/support/tickets/TicketStatusBadges";

const SupportTickets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "support"
  });

  // Verificar se há parâmetros de categoria na URL para pré-preencher o modal
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    
    if (categoryParam) {
      setTicketData(prev => ({ ...prev, category: categoryParam }));
      setIsDialogOpen(true);
    }
  }, [location]);

  useEffect(() => {
    if (profile?.id) {
      fetchTickets();
    }
  }, [profile, activeTab]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("support_tickets")
        .select("*")
        .eq("customer_id", profile?.id)
        .order("created_at", { ascending: false });

      if (activeTab !== "all") {
        query = query.eq("status", activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
      toast.error("Erro ao carregar seus chamados de suporte");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  };

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
        category: "support"
      });
      
      // Atualizar a lista de tickets
      await fetchTickets();
      
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
    <div className="container max-w-4xl py-10">
      <TicketsHeader 
        onCreateTicket={() => setIsDialogOpen(true)} 
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <Card>
        <CardHeader className="pb-0">
          <TicketStatusTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </CardHeader>
        <CardContent className="pt-6">
          <TicketsList 
            tickets={tickets}
            loading={loading}
            activeTab={activeTab}
            onCreateTicket={() => setIsDialogOpen(true)}
            getPriorityBadge={getPriorityBadge}
            getStatusBadge={getStatusBadge}
          />
        </CardContent>
      </Card>

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

export default SupportTickets;
