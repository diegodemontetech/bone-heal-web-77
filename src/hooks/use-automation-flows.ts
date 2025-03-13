
import { useFlowsQuery } from './automation/use-flows-query';
import { useFlowMutations } from './automation/use-flow-mutations';
import { useFlowActions } from './automation/use-flow-actions';

export const useAutomationFlows = () => {
  const { flows, isLoading, error, fetchFlows, setFlows } = useFlowsQuery();
  const { createFlow, updateFlow } = useFlowMutations(flows, setFlows);
  const { duplicateFlow, deleteFlow, toggleFlowStatus } = useFlowActions(flows, setFlows);
  
  return {
    flows,
    isLoading,
    error,
    fetchFlows,
    createFlow,
    updateFlow,
    duplicateFlow,
    deleteFlow,
    toggleFlowStatus
  };
};
