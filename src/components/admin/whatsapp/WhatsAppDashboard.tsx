import { useState, useEffect } from "react";
import { useWhatsAppInstances } from "./hooks/useWhatsAppInstances";
import { useWhatsAppMessages } from "./hooks/useWhatsAppMessages";
import { useLeadsQuery } from "../kanban/hooks/useLeadsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Plus, QrCode, RefreshCw, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";

// Interface para mensagens formatadas para exibição
interface WhatsAppMessage {
  id: string;
  message: string;
  created_at: string;
  sent_by: 'user' | 'contact';
  is_bot: boolean;
  media_url?: string | null;
  media_type?: string | null;
}

const WhatsAppDashboard = () => {
  const { profile } = useAuth();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [qrVisible, setQrVisible] = useState(false);

  const { leads, isLoading: leadsLoading } = useLeadsQuery();
  const { 
    instances, 
    loading: instancesLoading, 
    createInstance, 
    refreshQrCode,
    isCreating
  } = useWhatsAppInstances();
  
  const { 
    messages, 
    loading: messagesLoading, 
    sendMessage,
    refreshMessages
  } = useWhatsAppMessages(selectedLeadId || undefined);

  // Selecionar o primeiro lead automaticamente se nenhum estiver selecionado
  useEffect(() => {
    if (!selectedLeadId && leads && leads.length > 0) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  // Rolar para a última mensagem quando novas mensagens chegarem
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedLeadId) return;
    
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage("");
    } else {
      toast.error("Erro ao enviar mensagem");
    }
  };

  const handleCreateInstance = async () => {
    if (!profile) return;
    
    const instanceName = `${profile.full_name || 'User'}-${new Date().toISOString().slice(0, 10)}`;
    await createInstance(instanceName);
    setQrVisible(true);
    setActiveTab("instances");
  };

  const handleRefreshQrCode = async (instanceId: string) => {
    await refreshQrCode(instanceId);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM, HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Formatar mensagens para exibição
  const formattedMessages: WhatsAppMessage[] = messages.map(message => ({
    ...message,
    sent_by: message.direction === 'outgoing' ? 'user' : 'contact'
  })) as WhatsAppMessage[];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar com lista de leads */}
      <div className="w-64 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Conversas</h2>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {leadsLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : leads && leads.length > 0 ? (
            <div className="space-y-1 p-2">
              {leads.map((lead) => (
                <Button
                  key={lead.id}
                  variant={selectedLeadId === lead.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>
                        {(lead.name || "").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium truncate w-36">
                        {lead.name || lead.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(lead.last_contact || lead.created_at)}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Nenhum lead encontrado
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Área principal */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-4 py-2">
            <TabsList>
              <TabsTrigger value="chats" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Conversas
              </TabsTrigger>
              <TabsTrigger value="instances" className="flex items-center">
                <QrCode className="h-4 w-4 mr-2" />
                Instâncias
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chats" className="flex-1 flex flex-col p-0 m-0">
            {selectedLeadId ? (
              <>
                {/* Cabeçalho do chat */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarFallback>
                        {leads?.find(l => l.id === selectedLeadId)?.name?.substring(0, 2).toUpperCase() || "CL"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {leads?.find(l => l.id === selectedLeadId)?.name || "Cliente"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {leads?.find(l => l.id === selectedLeadId)?.phone || ""}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => refreshMessages()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Área de mensagens */}
                <ScrollArea 
                  id="chat-messages" 
                  className="flex-1 p-4"
                >
                  {messagesLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : formattedMessages.length > 0 ? (
                    <div className="space-y-4">
                      {formattedMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sent_by === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.sent_by === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.media_url && (
                              <div className="mb-2">
                                {msg.media_type?.startsWith("image/") ? (
                                  <img
                                    src={msg.media_url}
                                    alt="Imagem"
                                    className="rounded max-h-48 max-w-full"
                                  />
                                ) : (
                                  <a
                                    href={msg.media_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    Ver anexo
                                  </a>
                                )}
                              </div>
                            )}
                            <p>{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.sent_by === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatDate(msg.created_at)}
                              {msg.is_bot && " • Bot"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground p-4">
                      Nenhuma mensagem encontrada. Inicie uma conversa!
                    </div>
                  )}
                </ScrollArea>

                {/* Área de input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Selecione um lead para iniciar uma conversa
              </div>
            )}
          </TabsContent>

          <TabsContent value="instances" className="flex-1 p-4 m-0">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Instâncias do WhatsApp</h2>
              <Button onClick={handleCreateInstance} disabled={isCreating}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Instância
              </Button>
            </div>

            {instancesLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : instances.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {instances.map((instance) => (
                  <Card key={instance.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{instance.instance_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Status:</p>
                          <p className="text-sm">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                instance.status === "connected"
                                  ? "bg-green-500"
                                  : instance.status === "connecting"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            {instance.status === "connected"
                              ? "Conectado"
                              : instance.status === "connecting"
                              ? "Conectando"
                              : "Desconectado"}
                          </p>
                        </div>

                        {instance.qr_code && (
                          <div>
                            <p className="text-sm font-medium mb-2">QR Code:</p>
                            <img
                              src={`data:image/png;base64,${instance.qr_code}`}
                              alt="QR Code"
                              className="w-full max-w-[200px] mx-auto"
                            />
                          </div>
                        )}

                        <div className="pt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleRefreshQrCode(instance.id)}
                            className="w-full"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Atualizar QR Code
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhuma instância encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie uma nova instância para começar a usar o WhatsApp.
                </p>
                <Button onClick={handleCreateInstance} disabled={isCreating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Instância
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;
