
import { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowInstance
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Save, Play, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Importando os nós customizados
import TriggerNode from "./nodes/TriggerNode";
import ActionNode from "./nodes/ActionNode";
import ConditionNode from "./nodes/ConditionNode";

// Registrando os tipos de nós
const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
};

interface FlowBuilderProps {
  flowId: string | null;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const FlowBuilder = ({ flowId }: FlowBuilderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [flowName, setFlowName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (flowId) {
      fetchFlowData();
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setFlowName("");
    }
  }, [flowId]);

  const fetchFlowData = async () => {
    if (!flowId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("automation_flows")
        .select("*")
        .eq("id", flowId)
        .single();

      if (error) throw error;

      if (data) {
        setFlowName(data.name);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      }
    } catch (error) {
      console.error("Erro ao carregar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o fluxo de trabalho",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${nodeData.type}_${Date.now()}`,
        type: nodeData.nodeType,
        position,
        data: { 
          label: nodeData.label, 
          action: nodeData.action,
          service: nodeData.service,
          icon: nodeData.icon
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const saveFlow = async () => {
    if (!flowId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("automation_flows")
        .update({
          nodes,
          edges,
          updated_at: new Date().toISOString(),
        })
        .eq("id", flowId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fluxo de trabalho salvo com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o fluxo de trabalho",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const executeFlow = async () => {
    if (!flowId) return;

    try {
      // Simular execução (em um sistema real, chamaria uma função do backend)
      toast({
        title: "Executando fluxo",
        description: "O fluxo foi iniciado. Acompanhe o progresso nos logs.",
      });
      
      // Aqui você faria uma chamada para sua Edge Function que executa o fluxo
    } catch (error) {
      console.error("Erro ao executar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível executar o fluxo de trabalho",
        variant: "destructive",
      });
    }
  };

  if (!flowId) {
    return (
      <div className="h-[600px] flex items-center justify-center border rounded-md">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Selecione um fluxo para editar ou crie um novo</p>
          <ArrowLeft className="mx-auto h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] border rounded-md">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <p>Carregando fluxo...</p>
        </div>
      ) : (
        <div className="h-full">
          <div className="bg-background p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Input
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="w-64 text-lg font-medium"
                disabled
              />
              <Badge variant={nodes.length > 0 ? "outline" : "secondary"}>
                {nodes.length} nós
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={executeFlow} 
                size="sm" 
                variant="outline"
                disabled={nodes.length === 0 || edges.length === 0}
              >
                <Play className="mr-2 h-4 w-4" /> Executar
              </Button>
              <Button 
                onClick={saveFlow} 
                disabled={isSaving}
                size="sm"
              >
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      )}
    </div>
  );
};

export default FlowBuilder;
