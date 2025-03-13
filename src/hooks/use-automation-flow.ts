
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edge, Node, useNodesState, useEdgesState, ReactFlowInstance, addEdge } from 'reactflow';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AutomationFlow } from '@/types/automation';
import { stringifyForSupabase } from '@/utils/supabaseJsonUtils';
import { parseJsonArray } from '@/utils/supabaseJsonUtils';

export const useAutomationFlow = (flowId: string | null) => {
  const [nodes, setNodes] = useNodesState<any>([]);
  const [edges, setEdges] = useEdgesState<any>([]);
  const [flowName, setFlowName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const queryClient = useQueryClient();

  const fetchFlowData = useCallback(async () => {
    if (!flowId) return null;
    
    try {
      console.log('Buscando dados do fluxo:', flowId);
      const { data, error } = await supabase
        .from('automation_flows')
        .select('*')
        .eq('id', flowId)
        .single();
        
      if (error) throw error;
      
      console.log('Dados do fluxo recuperados:', data);
      
      setFlowName(data.name || '');
      
      // Parse nodes e edges do JSON usando a função auxiliar
      const parsedNodes = parseJsonArray(data.nodes, []);
      const parsedEdges = parseJsonArray(data.edges, []);
      
      console.log('Nodes parseados:', parsedNodes);
      console.log('Edges parseados:', parsedEdges);
      
      setNodes(parsedNodes);
      setEdges(parsedEdges);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do fluxo:', error);
      toast.error('Erro ao carregar fluxo');
      return null;
    }
  }, [flowId, setNodes, setEdges]);

  // Consulta para buscar os dados do fluxo
  const { isLoading } = useQuery({
    queryKey: ['automation-flow', flowId],
    queryFn: fetchFlowData,
    enabled: !!flowId,
  });

  // Mutação para salvar o fluxo
  const { mutate: saveFlowMutation } = useMutation({
    mutationFn: async (flowData: Partial<AutomationFlow>) => {
      if (!flowId) throw new Error('ID do fluxo não disponível');
      
      try {
        console.log('Salvando fluxo:', flowData);
        
        const dataToSave = {
          ...flowData,
          name: flowData.name || flowName,
          nodes: stringifyForSupabase(flowData.nodes || []),
          edges: stringifyForSupabase(flowData.edges || [])
        };
        
        const { error } = await supabase
          .from('automation_flows')
          .update(dataToSave)
          .eq('id', flowId);
          
        if (error) throw error;
        
        return { success: true };
      } catch (error) {
        console.error('Erro ao salvar fluxo:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-flow', flowId] });
      toast.success('Fluxo salvo com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar fluxo');
    }
  });

  const saveFlow = async (flowData: Partial<AutomationFlow>) => {
    setIsSaving(true);
    try {
      await saveFlowMutation(flowData);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const executeFlow = async () => {
    if (!flowId) return false;
    
    toast.info('Executando fluxo...');
    try {
      // Chamada para executar o fluxo
      const { error } = await supabase.functions.invoke('execute-workflow', {
        body: { flow_id: flowId }
      });
      
      if (error) throw error;
      
      toast.success('Fluxo executado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao executar fluxo:', error);
      toast.error('Erro ao executar fluxo');
      return false;
    }
  };

  // Funções para gerenciar os nós e bordas
  const onNodesChange = useCallback(
    (changes) => setNodes(changes),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges(changes),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (!type || !position) return;

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

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
