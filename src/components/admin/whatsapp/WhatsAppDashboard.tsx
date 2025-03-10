
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import { 
  MessageCircle, 
  Users, 
  MoreVertical, 
  Send,
  Phone,
  UserPlus,
  RefreshCw,
  ShoppingCart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CreateOrder from "../CreateOrder";

interface WhatsAppMessage {
  id: string;
  lead_id: string;
  message: string;
  direction: 'inbound' | 'outbound';
  sent_by: 'cliente' | 'bot' | 'agente';
  created_at: string;
  agent_id?: string;
  order_id?: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  last_contact: string;
  intention?: string;
  needs_human?: boolean;
  email?: string;
}

const WhatsAppDashboard = () => {
  const { profile } = useAuth();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [createOrderMode, setCreateOrderMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar leads
  const { data: leads = [], isLoading: isLoadingLeads, refetch: refetchLeads } = useQuery({
    queryKey: ["whatsapp-leads", refreshKey, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .order("last_contact", { ascending: false });
      
      // Aplicar filtro de status
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar leads:", error);
        return [];
      }
      
      return data as Lead[];
    },
  });

  // Filtrar leads por termo de busca
  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
      (lead.phone && lead.phone.includes(searchLower)) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower))
    );
  });

  // Buscar mensagens do lead selecionado
  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["whatsapp-messages", selectedLead?.id, refreshKey],
    queryFn: async () => {
      if (!selectedLead) return [];

      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("lead_id", selectedLead.id)
        .order("created_at");

      if (error) {
        console.error("Erro ao buscar mensagens:", error);
        return [];
      }
      
      return data as WhatsAppMessage[];
    },
    enabled: !!selectedLead,
  });

  // Configurar atualizações em tempo real
  useEffect(() => {
    const leadsChannel = supabase
      .channel('public:leads')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads'
      }, () => {
        refetchLeads();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('public:whatsapp_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'whatsapp_messages'
      }, (payload) => {
        if (selectedLead && payload.new.lead_id === selectedLead.id) {
          refetchMessages();
        } else {
          // Se for uma nova mensagem de outro lead, atualizar lista de leads
          refetchLeads();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [selectedLead, refetchLeads, refetchMessages]);

  // Função para enviar mensagem
  const handleSendMessage = async () => {
    if (!selectedLead || !message.trim()) return;

    try {
      // Primeiro registrar mensagem no banco de dados
      const { data: messageData, error: messageError } = await supabase
        .from("whatsapp_messages")
        .insert({
          lead_id: selectedLead.id,
          message: message.trim(),
          direction: 'outbound',
          sent_by: 'agente',
          agent_id: profile?.id
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Atualizar status do lead
      await supabase
        .from("leads")
        .update({
          status: 'atendido_humano',
          last_contact: new Date().toISOString()
        })
        .eq("id", selectedLead.id);

      // Enviar mensagem via API
      const { error: sendError } = await supabase
        .functions
        .invoke("send-whatsapp", {
          body: {
            phone: selectedLead.phone,
            message: message.trim(),
            name: selectedLead.name,
            isAgent: true,
            agentId: profile?.id
          }
        });

      if (sendError) throw sendError;

      setMessage("");
      refetchMessages();
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error(`Erro ao enviar mensagem: ${error.message}`);
    }
  };

  // Função para mudar status do lead
  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await supabase
        .from("leads")
        .update({ status })
        .eq("id", id);

      toast.success(`Status atualizado para: ${status}`);
      refetchLeads();
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast.error(`Erro ao atualizar status: ${error.message}`);
    }
  };

  // Função para finalizar o pedido
  const handleOrderComplete = () => {
    setCreateOrderMode(false);
    setRefreshKey(prev => prev + 1);
    toast.success("Pedido criado com sucesso para o cliente!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Atendimento WhatsApp</h1>

      {createOrderMode && selectedLead ? (
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => setCreateOrderMode(false)}
            className="mb-4"
          >
            &larr; Voltar para atendimento
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Criar Pedido para {selectedLead.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateOrder onCancel={() => setCreateOrderMode(false)} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Lista de Leads */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Contatos
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setRefreshKey(prev => prev + 1)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar por nome ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="novo">Novos</SelectItem>
                      <SelectItem value="aguardando">Aguardando</SelectItem>
                      <SelectItem value="aguardando_atendente">Aguardando Atendente</SelectItem>
                      <SelectItem value="atendido_bot">Atendido Bot</SelectItem>
                      <SelectItem value="atendido_humano">Atendido Humano</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto px-6">
              {isLoadingLeads ? (
                <div className="flex justify-center p-4">
                  <p>Carregando contatos...</p>
                </div>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 rounded flex justify-between items-center
                      ${selectedLead?.id === lead.id ? "bg-gray-100" : ""}
                      ${lead.needs_human ? "border-l-4 border-l-orange-500" : ""}
                    `}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div>
                      <div className="font-medium">{lead.name || "Sem nome"}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {lead.intention ? 
                          <span className="bg-blue-100 text-blue-800 px-1 rounded text-xs">
                            {lead.intention}
                          </span> : null
                        }
                        {" "}
                        <span className={`px-1 rounded text-xs ${
                          lead.status === 'novo' ? 'bg-green-100 text-green-800' :
                          lead.status === 'aguardando_atendente' ? 'bg-orange-100 text-orange-800' :
                          lead.status === 'atendido_humano' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                          <MessageCircle className="w-4 h-4 mr-2" /> 
                          Conversar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'novo')}>
                          Novo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'aguardando')}>
                          Aguardando
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'atendido_humano')}>
                          Atendido Humano
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'finalizado')}>
                          Finalizado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhum contato encontrado
                </div>
              )}
            </div>
          </Card>

          {/* Chat com Lead selecionado */}
          <Card className="md:col-span-2">
            {selectedLead ? (
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {selectedLead.name || "Contato"}
                      <div className="text-sm font-normal text-muted-foreground">
                        {selectedLead.phone}
                        {selectedLead.email && ` • ${selectedLead.email}`}
                      </div>
                    </CardTitle>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Dados
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Dados do Cliente</DialogTitle>
                            <DialogDescription>
                              Visualize e edite informações do cliente
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right">Nome</label>
                              <Input 
                                value={selectedLead.name || ''} 
                                className="col-span-3"
                                readOnly
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right">Telefone</label>
                              <Input 
                                value={selectedLead.phone || ''} 
                                className="col-span-3"
                                readOnly
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right">Email</label>
                              <Input 
                                value={selectedLead.email || ''} 
                                className="col-span-3"
                                readOnly
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label className="text-right">Status</label>
                              <Select 
                                value={selectedLead.status} 
                                onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="novo">Novo</SelectItem>
                                  <SelectItem value="aguardando">Aguardando</SelectItem>
                                  <SelectItem value="aguardando_atendente">Aguardando Atendente</SelectItem>
                                  <SelectItem value="atendido_bot">Atendido Bot</SelectItem>
                                  <SelectItem value="atendido_humano">Atendido Humano</SelectItem>
                                  <SelectItem value="finalizado">Finalizado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="default"
                        onClick={() => setCreateOrderMode(true)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Criar Pedido
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100vh-300px)] flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {isLoadingMessages ? (
                      <div className="flex justify-center p-4">
                        <p>Carregando mensagens...</p>
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.direction === "inbound" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg p-3 ${
                              msg.direction === "inbound"
                                ? "bg-gray-100"
                                : msg.sent_by === 'bot' 
                                  ? "bg-blue-100" 
                                  : "bg-green-100"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{msg.message}</div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-between">
                              <span>
                                {new Date(msg.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {msg.direction === "outbound" && (
                                <span className="ml-2">
                                  {msg.sent_by === 'bot' ? 'Bot' : 'Atendente'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Nenhuma mensagem encontrada para este contato.
                      </div>
                    )}
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center space-x-2">
                      <Textarea
                        placeholder="Digite sua mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Selecione um contato para iniciar a conversa</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default WhatsAppDashboard;
