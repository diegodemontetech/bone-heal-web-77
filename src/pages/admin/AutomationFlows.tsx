
// Corrigindo o componente para não passar onSelectFlow
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlowsList from "@/components/admin/automation/FlowsList";
import FlowBuilder from "@/components/admin/automation/FlowBuilder";

const AutomationFlowsPage: React.FC = () => {
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(selectedFlowId ? "editor" : "list");

  const handleSelectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setActiveTab("editor");
  };

  const handleCreateFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setActiveTab("editor");
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
            onFlowCreate={handleCreateFlow} 
          />
        </TabsContent>

        <TabsContent value="editor" className="mt-0">
          {selectedFlowId && <FlowBuilder flowId={selectedFlowId} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationFlowsPage;
