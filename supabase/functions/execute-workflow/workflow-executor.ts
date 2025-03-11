
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Workflow, ExecutionResults, NodeResult } from "./types.ts";
import { simulateAction, simulateCondition } from "./action-simulators.ts";

/**
 * Executa um fluxo de trabalho com os dados de trigger fornecidos.
 */
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
  
  // Iniciar a execução a partir dos nós de gatilho
  for (const triggerNode of triggerNodes) {
    await processNode(triggerNode.id, triggerData);
  }
  
  return results;

  /**
   * Registra informações sobre a execução de um nó.
   */
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
  
  /**
   * Executa a operação específica para o tipo de nó.
   */
  function executeNodeOperation(node: any, inputData: any): any {
    switch (node.type) {
      case "triggerNode":
        return { ...triggerData, trigger: node.data.action };
      
      case "actionNode":
        return simulateAction(node.data.service, node.data.action, inputData);
      
      case "conditionNode":
        return simulateCondition(node.data.action, inputData);
      
      default:
        return { ...inputData };
    }
  }
  
  /**
   * Encontra as próximas arestas a serem seguidas após a execução de um nó.
   */
  function findNextEdges(nodeId: string, nodeType: string, conditionResult?: boolean): any[] {
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    // Para nós de condição, filtra as arestas com base no resultado
    if (nodeType === "conditionNode" && conditionResult !== undefined) {
      return outgoingEdges.filter(edge => 
        (conditionResult && edge.sourceHandle === "true") || 
        (!conditionResult && edge.sourceHandle === "false")
      );
    }
    
    return outgoingEdges;
  }
  
  /**
   * Processa um nó e seus nós subsequentes recursivamente.
   */
  async function processNode(nodeId: string, inputData: any): Promise<any> {
    // Evitar processamento em loop
    if (processedNodes.has(nodeId)) {
      return results[nodeId];
    }
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Nó não encontrado: ${nodeId}`);
    }
    
    await logExecution(nodeId, "processing", { input: inputData });
    
    let result;
    
    try {
      // Executar a operação específica do nó
      result = executeNodeOperation(node, inputData);
      
      await logExecution(nodeId, "completed", { result });
      
    } catch (error) {
      result = { error: error.message };
      await logExecution(nodeId, "error", { error: error.message });
      throw error;
    }
    
    results[nodeId] = result;
    processedNodes.add(nodeId);
    
    // Encontrar e processar os próximos nós
    const nextEdges = findNextEdges(
      nodeId, 
      node.type, 
      node.type === "conditionNode" ? result.result === true : undefined
    );
    
    for (const edge of nextEdges) {
      await processNode(edge.target, result);
    }
    
    return result;
  }
}
