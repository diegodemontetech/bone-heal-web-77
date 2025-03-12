import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node, Edge, useNodesState, useEdgesState, XYPosition } from 'reactflow';
import { Json } from '@/integrations/supabase/types';
import { parseJsonArray } from "@/utils/supabaseJsonUtils";

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

export const useAutomationFlow = (flowId: string) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const queryClient = useQueryClient();

  const { data: flowData, isLoading, error } = useQuery({
    queryKey: ['automationFlow', flowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_flows')
        .select('*')
        .eq('id', flowId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (flow) => {
      setNodes(flow.nodes ? parseJsonArray(flow.nodes, []) : []);
      setEdges(flow.edges ? parseJsonArray(flow.edges, []) : []);
    },
  });

  const upsertFlowMutation = useMutation(
    async (flow: Partial<AutomationFlow>) => {
      const { data, error } = await supabase
        .from('automation_flows')
        .upsert({ ...flow, id: flowId }, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['automationFlow', flowId]);
      },
    }
  );

  const onSave = useCallback(async (flowData: Partial<AutomationFlow>) => {
    const updatedFlow = {
      ...flowData,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges)
    };
    upsertFlowMutation.mutate(updatedFlow);
  }, [nodes, edges, upsertFlowMutation]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    flowData,
    isLoading,
    error,
    onSave,
  };
};
