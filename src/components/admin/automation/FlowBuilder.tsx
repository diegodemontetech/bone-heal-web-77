
import { useEffect } from "react";
import FlowToolbar from "./FlowToolbar";
import FlowCanvas from "./FlowCanvas";
import NoFlowSelected from "./NoFlowSelected";
import { useAutomationFlow } from "@/hooks/use-automation-flow";
import { Card } from "@/components/ui/card";

interface FlowBuilderProps {
  flowId: string | null;
  onCreateFlow?: () => void;
}

const FlowBuilder = ({ flowId, onCreateFlow }: FlowBuilderProps) => {
  const {
    nodes,
    edges,
    flowName,
    isLoading,
    isSaving,
    reactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    setReactFlowInstance,
    fetchFlowData,
    saveFlow,
    executeFlow,
    setFlowName,
  } = useAutomationFlow(flowId);

  useEffect(() => {
    if (flowId) {
      fetchFlowData();
    }
  }, [flowId, fetchFlowData]);

  if (!flowId) {
    return <NoFlowSelected onCreateFlow={onCreateFlow} />;
  }

  // Corrigimos a função handleSave para não retornar um boolean explicitamente
  const handleSave = async (): Promise<void> => {
    await saveFlow({ 
      nodes,
      edges,
      name: flowName
    });
    // Não retorna valor, apenas uma Promise<void>
  };

  const handleExecute = () => {
    executeFlow();
  };

  const canExecute = nodes.length > 0 && edges.length > 0;

  return (
    <Card className="h-[600px] border overflow-hidden">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">Carregando fluxo...</p>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <FlowToolbar
            flowName={flowName}
            onFlowNameChange={setFlowName}
            nodeCount={nodes.length}
          />
          <div className="flex-grow">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onSave={handleSave}
              onExecute={handleExecute}
              isSaving={isSaving}
              canExecute={canExecute}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default FlowBuilder;
