
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WhatsAppInstance, WhatsAppMessage } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { CreateInstanceDialog } from "./dashboard/dialogs/CreateInstanceDialog";
import WhatsAppInstanceCard from "./WhatsAppInstanceCard";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useWhatsAppInstanceActions } from "@/hooks/admin/whatsapp/useWhatsAppInstanceActions";

const WhatsAppDashboard = () => {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instances");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { 
    handleCreateInstance, 
    handleDeleteInstance, 
    handleRefreshQr,
    isCreating 
  } = useWhatsAppInstanceActions();

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("whatsapp_instances")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedInstances: WhatsAppInstance[] = data.map(instance => ({
        id: instance.id,
        name: instance.instance_name,
        instance_name: instance.instance_name,
        status: instance.status,
        qr_code: instance.qr_code || '',
        user_id: instance.user_id,
        created_at: instance.created_at,
        updated_at: instance.updated_at
      }));

      setInstances(formattedInstances);
    } catch (error) {
      console.error("Erro ao buscar instâncias:", error);
      toast.error("Erro ao carregar instâncias do WhatsApp");
    } finally {
      setIsLoading(false);
    }
  };

  const selectInstance = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setActiveTab("chat");
  };

  const onCreateInstanceHandler = async (instanceName: string) => {
    const success = await handleCreateInstance(instanceName);
    if (success) {
      await fetchInstances();
      return instances.find(inst => inst.instance_name === instanceName) || null;
    }
    return null;
  };

  const handleSendMessage = async (message: string) => {
    // Implementação do envio de mensagem
    return true;
  };

  return (
    <Card className="h-[80vh] flex flex-col">
      <CardHeader>
        <CardTitle>WhatsApp</CardTitle>
        <CardDescription>
          Gerencie suas conexões e conversas do WhatsApp
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="instances">Instâncias</TabsTrigger>
            {selectedInstanceId && (
              <TabsTrigger value="chat">Conversa</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="instances" className="h-full space-y-4 overflow-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Instâncias disponíveis</h3>
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                disabled={instances.length >= 5}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Instância
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : instances.length === 0 ? (
              <div className="text-center p-8 border rounded-md bg-muted/20">
                <p className="text-muted-foreground mb-4">
                  Nenhuma instância encontrada
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira instância
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instances.map(instance => (
                  <WhatsAppInstanceCard
                    key={instance.id}
                    instance={instance}
                    onSelect={() => selectInstance(instance.id)}
                    onRefreshQr={() => handleRefreshQr(instance.id)}
                    onDelete={() => handleDeleteInstance(instance.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="h-full overflow-hidden">
            {selectedInstanceId ? (
              <>
                <div className="mb-4">
                  <Button variant="outline" onClick={() => setActiveTab("instances")}>
                    Voltar para instâncias
                  </Button>
                </div>
                
                <div className="h-[calc(100%-3rem)] border rounded-md">
                  {/* Implementação do chat aqui */}
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Funcionalidade de chat em desenvolvimento</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  Selecione uma instância para ver o chat
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CreateInstanceDialog
        isOpen={isDialogOpen}
        isCreating={isCreating}
        onClose={() => setIsDialogOpen(false)}
        onOpenChange={setIsDialogOpen}
        onCreateInstance={onCreateInstanceHandler}
      />
    </Card>
  );
};

export default WhatsAppDashboard;
