
import { useEffect, useState } from "react";
import FlowToolbar from "./FlowToolbar";
import FlowCanvas from "./FlowCanvas";
import NoFlowSelected from "./NoFlowSelected";
import FlowCreateForm from "./flows/FlowCreateForm";
import { useAutomationFlow } from "@/hooks/use-automation-flow";
import { useNavigate } from "react-router-dom";
import { useAutomationFlows } from "@/hooks/use-automation-flows";

interface FlowBuilderProps {
  flowId: string | null;
}

const FlowBuilder = ({ flowId }: FlowBuilderProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    flows,
    createFlow
  } = useAutomationFlows();
  
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
      console.log('FlowBuilder: flowId mudou, buscando dados...', flowId);
      fetchFlowData();
    }
  }, [flowId, fetchFlowData]);

  const handleCreateFlow = async (
    name: string, 
    description: string, 
    departmentId?: string, 
    responsibleId?: string, 
    hasAttachment?: boolean
  ) => {
    try {
      console.log('Criando novo fluxo:', name, description);
      const newFlow = await createFlow(
        name, 
        description, 
        {
          department_id: departmentId,
          responsible_id: responsibleId,
          has_attachment: hasAttachment
        }
      );
      
      setIsCreateDialogOpen(false);
      
      if (newFlow) {
        navigate(`/admin/automation-flows/${newFlow.id}`);
      }
      
      return newFlow;
    } catch (error) {
      console.error('Erro ao criar fluxo:', error);
      return null;
    }
  };

  if (!flowId) {
    return (
      <>
        <NoFlowSelected onCreateNew={() => setIsCreateDialogOpen(true)} />
        <FlowCreateForm 
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreateFlow={handleCreateFlow}
          onComplete={() => {}}
        />
      </>
    );
  }

  const handleSave = () => {
    console.log('Salvando fluxo:', { nodes, edges, flowName });
    saveFlow({ 
      nodes,
      edges,
      name: flowName
    });
  };

  const handleExecute = () => {
    console.log('Executando fluxo...');
    executeFlow();
  };

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
            onSave={handleSave}
            onExecute={handleExecute}
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
