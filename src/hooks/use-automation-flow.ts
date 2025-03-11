
import { useState, useCallback } from "react";
import {
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAutomationFlow = (flowId: string | null) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [flowName, setFlowName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchFlowData = useCallback(async () => {
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
  }, [flowId, toast]);

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
      toast({
        title: "Executando fluxo",
        description: "O fluxo foi iniciado. Acompanhe o progresso nos logs.",
      });
    } catch (error) {
      console.error("Erro ao executar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível executar o fluxo de trabalho",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};
