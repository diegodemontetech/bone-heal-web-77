
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Headset, MessageSquare, ArrowLeft, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SupportTickets = () => {
  const navigate = useNavigate();
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
    priority: "medium"
  });

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Padrão</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aberto</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Em Andamento</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolvido</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Fechado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/profile")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Perfil
          </Button>
          <h1 className="text-2xl font-bold">Meus Chamados de Suporte</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Chamado
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

      <Card>
        <CardHeader className="pb-0">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="open">Abertos</TabsTrigger>
              <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
              <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16">
              <Headset className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium">Nenhum chamado encontrado</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Você ainda não possui chamados de suporte {activeTab !== "all" && `com status "${activeTab}"`}.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Chamado
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Link 
                  key={ticket.id} 
                  to={`/support/tickets/${ticket.id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <div className="flex space-x-2">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {ticket.description}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>ID: #{ticket.id.substring(0, 8)}</span>
                      <span>
                        {new Date(ticket.created_at).toLocaleDateString()} às {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTickets;
