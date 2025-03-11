
import { useEffect } from "react";
import FlowToolbar from "./FlowToolbar";
import FlowCanvas from "./FlowCanvas";
import NoFlowSelected from "./NoFlowSelected";
import { useAutomationFlow } from "@/hooks/use-automation-flow";

interface FlowBuilderProps {
  flowId: string | null;
}

const FlowBuilder = ({ flowId }: FlowBuilderProps) => {
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
    return <NoFlowSelected />;
  }

  return (
    <div className="h-[600px] border rounded-md">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <p>Carregando fluxo...</p>
        </div>
      ) : (
        <div className="h-full">
          <FlowToolbar
            flowName={flowName}
            onFlowNameChange={setFlowName}
            nodeCount={nodes.length}
            onSave={saveFlow}
            onExecute={executeFlow}
            isSaving={isSaving}
            canExecute={nodes.length > 0 && edges.length > 0}
          />
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />
        </div>
      )}
    </div>
  );
};

export default FlowBuilder;
