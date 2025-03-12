
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useWhatsAppDashboard } from "@/hooks/admin/whatsapp/useWhatsAppDashboard";
import { CreateInstanceDialog } from "./dashboard/dialogs/CreateInstanceDialog";
import { InstancesTab } from "./dashboard/instances/InstancesTab";
import { ChatTab } from "./dashboard/chat/ChatTab";

const WhatsAppDashboard = () => {
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedInstanceId,
    activeTab,
    setActiveTab,
    instances,
    isLoading,
    error,
    messages,
    messagesLoading,
    isCreating,
    handleCreateInstance,
    handleDeleteInstance,
    handleSelectInstance,
    handleSendMessage,
    handleRefreshQr
  } = useWhatsAppDashboard();

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
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Instância
        </Button>
        
        <CreateInstanceDialog
          isOpen={isDialogOpen}
          isCreating={isCreating}
          onClose={() => setIsDialogOpen(false)}
          onOpenChange={setIsDialogOpen}
          onCreateInstance={handleCreateInstance}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="chat" disabled={!selectedInstanceId}>
            Chat
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="instances">
          <InstancesTab
            instances={instances}
            isLoading={isLoading}
            onSelect={handleSelectInstance}
            onRefreshQr={handleRefreshQr}
            onDelete={handleDeleteInstance}
            onCreateDialogOpen={() => setIsDialogOpen(true)}
            onSelectInstance={handleSelectInstance}
            onDeleteInstance={handleDeleteInstance}
          />
        </TabsContent>
        
        <TabsContent value="chat">
          <ChatTab
            messages={messages}
            messagesLoading={messagesLoading}
            onSendMessage={handleSendMessage}
            selectedInstanceId={selectedInstanceId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppDashboard;
