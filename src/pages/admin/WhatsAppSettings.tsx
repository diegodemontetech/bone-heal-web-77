
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, Users, Settings, Webhook, Smartphone, Loader2 } from "lucide-react";
import { CreateInstanceDialog } from "@/components/admin/whatsapp/dashboard/dialogs/CreateInstanceDialog";
import { InstancesTab } from "@/components/admin/whatsapp/dashboard/instances/InstancesTab";
import { ChatTab } from "@/components/admin/whatsapp/dashboard/chat/ChatTab";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppInstances } from "@/hooks/admin/whatsapp/useWhatsAppInstances";
import { useWhatsAppMessages } from "@/hooks/admin/whatsapp/useWhatsAppMessages";

const WhatsAppSettings = () => {
  const [activeTab, setActiveTab] = useState("instances");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  const { 
    instances, 
    isLoading: instancesLoading, 
    fetchInstances 
  } = useWhatsAppInstances();
  
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
  } = useWhatsAppMessages(selectedInstanceId);

  useEffect(() => {
    // Selecionar a primeira instância conectada por padrão para o chat
    if (instances.length > 0 && !selectedInstanceId) {
      const connectedInstance = instances.find(i => i.status === "connected");
      if (connectedInstance) {
        setSelectedInstanceId(connectedInstance.id);
      }
    }
  }, [instances, selectedInstanceId]);

  const handleCreateInstance = async (instanceName: string): Promise<any> => {
    if (!instanceName.trim()) {
      toast.error("Nome da instância é obrigatório");
      return null;
    }

    try {
      setIsCreatingInstance(true);

      // Criar instância no banco de dados
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("whatsapp_instances")
        .insert({
          instance_name: instanceName,
          user_id: user.data.user?.id,
          status: "disconnected"
        })
        .select();

      if (error) throw error;

      toast.success("Instância criada com sucesso");
      await fetchInstances();
      
      return data[0];
    } catch (error) {
      console.error("Erro ao criar instância:", error);
      toast.error("Falha ao criar instância");
      return null;
    } finally {
      setIsCreatingInstance(false);
    }
  };

  const handleConnectInstance = async (instanceId: string): Promise<void> => {
    try {
      // Atualizar o status da instância para "connecting"
      const { error } = await supabase
        .from("whatsapp_instances")
        .update({ status: "connecting" })
        .eq("id", instanceId);

      if (error) throw error;

      // Gerar um QR code fake para demonstração
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-${instanceId}-${Date.now()}`;
      
      // Atualizar o QR code da instância
      await supabase
        .from("whatsapp_instances")
        .update({ qr_code: qrCode })
        .eq("id", instanceId);

      await fetchInstances();
      toast.info("Escaneie o QR code para conectar ao WhatsApp");
    } catch (error) {
      console.error("Erro ao conectar instância:", error);
      toast.error("Falha ao conectar instância");
    }
  };

  const handleDisconnectInstance = async (instanceId: string): Promise<boolean> => {
    try {
      // Atualizar o status da instância para "disconnected"
      const { error } = await supabase
        .from("whatsapp_instances")
        .update({ 
          status: "disconnected",
          qr_code: null
        })
        .eq("id", instanceId);

      if (error) throw error;

      await fetchInstances();
      
      // Se a instância desconectada for a selecionada, desselecionar
      if (selectedInstanceId === instanceId) {
        setSelectedInstanceId(null);
      }

      toast.success("Instância desconectada com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao desconectar instância:", error);
      toast.error("Falha ao desconectar instância");
      return false;
    }
  };

  const handleDeleteInstance = async (instanceId: string): Promise<boolean> => {
    try {
      // Excluir a instância do banco de dados
      const { error } = await supabase
        .from("whatsapp_instances")
        .delete()
        .eq("id", instanceId);

      if (error) throw error;

      await fetchInstances();
      
      // Se a instância excluída for a selecionada, desselecionar
      if (selectedInstanceId === instanceId) {
        setSelectedInstanceId(null);
      }

      toast.success("Instância excluída com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao excluir instância:", error);
      toast.error("Falha ao excluir instância");
      return false;
    }
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    if (!selectedInstanceId) {
      toast.error("Selecione uma instância primeiro");
      return false;
    }

    try {
      // Implementação simplificada apenas para demonstração
      return await sendMessage(message);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Falha ao enviar mensagem");
      return false;
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações do WhatsApp</h1>
          <p className="text-muted-foreground">
            Gerencie suas instâncias e conversas do WhatsApp
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="instances" className="flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            Instâncias
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instances" className="space-y-4">
          <InstancesTab
            instances={instances}
            isLoading={instancesLoading}
            onConnect={handleConnectInstance}
            onDisconnect={handleDisconnectInstance}
            onDelete={handleDeleteInstance}
            onCreateInstance={handleCreateInstance}
            onCreateDialogOpen={() => setIsCreateDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          {!selectedInstanceId ? (
            <Card>
              <CardHeader>
                <CardTitle>Selecione uma instância</CardTitle>
                <CardDescription>
                  Você precisa selecionar uma instância conectada para enviar mensagens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {instancesLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                      <span>Carregando instâncias...</span>
                    </div>
                  ) : instances.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <p className="text-muted-foreground mb-4">
                        Nenhuma instância encontrada. Crie uma nova instância para começar.
                      </p>
                      <Button onClick={() => {
                        setIsCreateDialogOpen(true);
                        setActiveTab("instances");
                      }}>
                        Criar Instância
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {instances.map((instance) => (
                        <Button
                          key={instance.id}
                          variant={instance.status === "connected" ? "default" : "outline"}
                          className="w-full justify-start"
                          disabled={instance.status !== "connected"}
                          onClick={() => setSelectedInstanceId(instance.id)}
                        >
                          <div className="flex items-center">
                            <span 
                              className={`w-2 h-2 rounded-full mr-2 ${
                                instance.status === "connected" ? "bg-green-500" : 
                                instance.status === "connecting" ? "bg-yellow-500" : 
                                "bg-red-500"
                              }`}
                            ></span>
                            {instance.instance_name}
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-[500px]">
              <ChatTab
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={instancesLoading}
                messagesLoading={messagesLoading}
                selectedInstanceId={selectedInstanceId}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateInstanceDialog
        isOpen={isCreateDialogOpen}
        isCreating={isCreatingInstance}
        onClose={() => setIsCreateDialogOpen(false)}
        onOpenChange={setIsCreateDialogOpen}
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
};

export default WhatsAppSettings;
