
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlowsList from "@/components/admin/automation/FlowsList";
import FlowBuilder from "@/components/admin/automation/FlowBuilder";
import { useParams, useNavigate } from "react-router-dom";

const AutomationFlowsPage: React.FC = () => {
  const { flowId } = useParams<{ flowId?: string }>();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(flowId || null);
  const [activeTab, setActiveTab] = useState<string>(flowId ? "editor" : "list");
  const navigate = useNavigate();

  // Atualiza o flowId quando o parâmetro da URL muda
  useEffect(() => {
    if (flowId) {
      setSelectedFlowId(flowId);
      setActiveTab("editor");
    }
  }, [flowId]);

  const handleSelectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setActiveTab("editor");
    navigate(`/admin/automation-flows/${flowId}`);
  };

  const handleCreateFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setActiveTab("editor");
    navigate(`/admin/automation-flows/${flowId}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "list") {
      navigate("/admin/automacoes");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Fluxos de Automação</h1>
          <TabsList>
            <TabsTrigger value="list">
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
