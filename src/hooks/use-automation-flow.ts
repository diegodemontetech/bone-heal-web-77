
import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node, Edge, useNodesState, useEdgesState, Connection, ReactFlowInstance } from 'reactflow';
import { Json } from '@/integrations/supabase/types';
import { parseJsonArray, stringifyForSupabase } from "@/utils/supabaseJsonUtils";

export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  nodes: Node[];
  edges: Edge[];
  created_at: string;
  updated_at: string;
}

export const useAutomationFlow = (flowId: string | null) => {
  const [flowName, setFlowName] = useState<string>("");
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isSaving, setIsSaving] = useState(false);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const queryClient = useQueryClient();

  const fetchFlowData = useCallback(async () => {
    if (!flowId) return;
    
    try {
      const { data, error } = await supabase
        .from('automation_flows')
        .select('*')
        .eq('id', flowId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setFlowName(data.name || "");
        setNodes(parseJsonArray(data.nodes, []));
        setEdges(parseJsonArray(data.edges, []));
      }
      
      return data;
    } catch (err) {
      console.error("Erro ao buscar dados do fluxo:", err);
      throw err;
    }
  }, [flowId, setNodes, setEdges]);

  const { data: flowData, isLoading, error } = useQuery({
    queryKey: ['automationFlow', flowId],
    queryFn: fetchFlowData,
    enabled: !!flowId,
  });

  const upsertFlowMutation = useMutation({
    mutationFn: async (flow: Partial<AutomationFlow>) => {
      const { data, error } = await supabase
        .from('automation_flows')
        .upsert({ 
          ...flow, 
          id: flowId as string,
          nodes: stringifyForSupabase(nodes),
          edges: stringifyForSupabase(edges)
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationFlow', flowId] });
    },
  });

  const saveFlow = useCallback(async () => {
    if (!flowId) return;
    setIsSaving(true);
    try {
      await upsertFlowMutation.mutateAsync({
        name: flowName,
        description: flowData?.description || "",
        is_active: flowData?.is_active || true
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar fluxo:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [flowId, flowName, flowData, nodes, edges, upsertFlowMutation]);

  const executeFlow = useCallback(async () => {
    if (!flowId) return;
    
    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/execute-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flowId }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao executar o fluxo');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao executar fluxo:", error);
      throw error;
    }
  }, [flowId]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => [...eds, { ...connection, id: `e-${Math.random()}` }]);
  }, [setEdges]);

  const setReactFlowInstance = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstanceRef.current) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const service = event.dataTransfer.getData('service');
      const action = event.dataTransfer.getData('action');
      const label = event.dataTransfer.getData('label');

      if (!type) return;

      const position = reactFlowInstanceRef.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label, service, action },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    flowName,
    isLoading,
    isSaving,
    error,
    flowData,
    reactFlowInstance: reactFlowInstanceRef.current,
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
