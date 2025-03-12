import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useWhatsAppInstances } from "@/hooks/use-whatsapp-instances";
import { useWhatsAppMessages } from "@/hooks/use-whatsapp-messages";
import QRCode from "react-qr-code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatsAppInstanceCard from "./WhatsAppInstanceCard";
import WhatsAppChat from "./WhatsAppChat";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";

const WhatsAppDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("instances");
  const [userId, setUserId] = useState<string | null>(null);
  
  const { 
    instances, 
    isLoading, 
    error, 
    fetchInstances, 
    createInstance, 
    refreshQrCode,
    isCreating
  } = useWhatsAppInstances();
  
  const { 
    messages, 
    loading: messagesLoading, 
    sendMessage 
  } = useWhatsAppMessages(selectedInstanceId);

  // Fetch instances on component mount
  useEffect(() => {
    fetchInstances();
    
    // Get current user ID
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) {
      toast.error("Nome da instância não pode estar vazio");
      return;
    }
    
    const instance = await createInstance(newInstanceName);
    
    if (instance) {
      setIsDialogOpen(false);
      setNewInstanceName("");
      setSelectedInstanceId(instance.id);
      setActiveTab("chat");
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta instância?")) {
      // Implemente a lógica de exclusão aqui
      console.log("Deletando instância:", instanceId);
    }
  };

  const handleSelectInstance = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setActiveTab("chat");
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedInstanceId || !message.trim()) return false;
    
    // Lógica para enviar mensagem
    return true;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h3 className="font-semibold">Erro ao carregar instâncias WhatsApp</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">WhatsApp</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Instância
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Instância WhatsApp</DialogTitle>
              <DialogDescription>
                Insira um nome para identificar sua nova instância WhatsApp.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                placeholder="Nome da Instância"
                value={newInstanceName}
                onChange={(e) => setNewInstanceName(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateInstance}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="chat" disabled={!selectedInstanceId}>
            Chat
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="instances">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : instances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instances.map((instance) => (
                <WhatsAppInstanceCard
                  key={instance.id}
                  instance={instance}
                  onSelect={() => handleSelectInstance(instance.id)}
                  onRefreshQr={() => refreshQrCode(instance.id)}
                  onDelete={() => handleDeleteInstance(instance.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                Você ainda não tem nenhuma instância WhatsApp.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Instância
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="chat">
          {selectedInstanceId && (
            <WhatsAppChat 
              messages={messages}
              isLoading={messagesLoading}
              onSendMessage={handleSendMessage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppDashboard;
