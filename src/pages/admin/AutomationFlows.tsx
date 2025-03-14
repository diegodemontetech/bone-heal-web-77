
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlowsList from "@/components/admin/automation/FlowsList";
import FlowBuilder from "@/components/admin/automation/FlowBuilder";
import ActionsPalette from "@/components/admin/automation/ActionsPalette";
import { Dialog } from "@/components/ui/dialog";
import FlowCreateForm from "@/components/admin/automation/flows/FlowCreateForm";
import { useAutomationFlows } from "@/hooks/use-automation-flows";

const AutomationFlowsPage: React.FC = () => {
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(selectedFlowId ? "editor" : "list");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const {
    flows,
    isLoading,
    createFlow,
    fetchFlows,
  } = useAutomationFlows();

  const handleSelectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setActiveTab("editor");
  };

  const handleCreateFlow = async (name: string, description: string) => {
    try {
      const newFlow = await createFlow(name, description);
      if (newFlow) {
        setSelectedFlowId(newFlow.id);
        setActiveTab("editor");
        setIsCreateDialogOpen(false);
        return newFlow;
      }
      return null;
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      return null;
    }
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Fluxos de Automação</h1>
          <TabsList>
            <TabsTrigger value="list" onClick={() => setActiveTab("list")}>
              Lista de Fluxos
            </TabsTrigger>
            <TabsTrigger value="editor" disabled={!selectedFlowId}>
              Editor de Fluxo
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-0">
          <FlowsList 
            onFlowSelect={handleSelectFlow} 
            onFlowCreate={openCreateDialog}
            flows={flows}
            isLoading={isLoading}
            onRefresh={fetchFlows}
          />
        </TabsContent>

        <TabsContent value="editor" className="mt-0">
          {selectedFlowId && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <ActionsPalette />
              </div>
              <div className="lg:col-span-3">
                <FlowBuilder 
                  flowId={selectedFlowId} 
                  onCreateFlow={openCreateDialog}
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <FlowCreateForm
          onCreateFlow={handleCreateFlow}
          onComplete={() => {}}
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateFlow}
        />
      </Dialog>
    </div>
  );
};

export default AutomationFlowsPage;
