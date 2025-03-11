
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Workflow, ExecutionResults } from "./types.ts";
import { simulateAction, simulateCondition } from "./action-simulators.ts";

export async function executeWorkflow(
  workflow: Workflow, 
  triggerData: any,
  executionId: string,
  supabase: any
): Promise<ExecutionResults> {
  const { nodes, edges } = workflow;
  
  // Encontrar nós iniciais (triggers)
  const triggerNodes = nodes.filter(node => node.type === "triggerNode");
  
  if (triggerNodes.length === 0) {
    throw new Error("Nenhum nó de gatilho encontrado");
  }
  
  const results: ExecutionResults = {};
  const processedNodes: Set<string> = new Set();
  
  // Log de execução
  async function logExecution(nodeId: string, status: string, data: any) {
    await supabase
      .from("workflow_execution_logs")
      .insert({
        execution_id: executionId,
        node_id: nodeId,
        status,
        data,
        timestamp: new Date().toISOString(),
      });
  }
  
  // Processar um nó
  async function processNode(nodeId: string, inputData: any): Promise<any> {
    if (processedNodes.has(nodeId)) {
      return results[nodeId]; // Evitar processamento em loop
    }
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Nó não encontrado: ${nodeId}`);
    }
    
    await logExecution(nodeId, "processing", { input: inputData });
    
    let result;
    
    try {
      // Aqui seria implementada a lógica real para cada tipo de nó
      switch (node.type) {
        case "triggerNode":
          result = { ...triggerData, trigger: node.data.action };
          break;
        
        case "actionNode":
          result = simulateAction(node.data.service, node.data.action, inputData);
          break;
        
        case "conditionNode":
          result = simulateCondition(node.data.action, inputData);
          break;
        
        default:
          result = { ...inputData };
      }
      
      await logExecution(nodeId, "completed", { result });
      
    } catch (error) {
      result = { error: error.message };
      await logExecution(nodeId, "error", { error: error.message });
      throw error;
    }
    
    results[nodeId] = result;
    processedNodes.add(nodeId);
    
    // Encontrar os próximos nós
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    for (const edge of outgoingEdges) {
      // Para condições, verificar o resultado
      if (node.type === "conditionNode") {
        const conditionResult = result.result === true;
        
        // Se a saída da condição não corresponder ao handle da aresta, pular
        if ((conditionResult && edge.sourceHandle !== "true") || 
            (!conditionResult && edge.sourceHandle !== "false")) {
          continue;
        }
      }
      
      // Processar o próximo nó
      await processNode(edge.target, result);
    }
    
    return result;
  }
  
  // Começar a execução a partir dos nós de gatilho
  for (const triggerNode of triggerNodes) {
    await processNode(triggerNode.id, triggerData);
  }
  
  return results;
}
