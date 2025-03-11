
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { corsHeaders } from "../_shared/cors.ts";

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { 
    label: string;
    service: string;
    action: string;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

interface ExecuteRequest {
  flowId: string;
  triggerData?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variáveis de ambiente do Supabase não configuradas");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { flowId, triggerData }: ExecuteRequest = await req.json();

    if (!flowId) {
      throw new Error("ID do fluxo não fornecido");
    }

    // Buscar dados do fluxo
    const { data: workflow, error } = await supabase
      .from("automation_flows")
      .select("*")
      .eq("id", flowId)
      .single();

    if (error || !workflow) {
      throw new Error("Fluxo não encontrado: " + error?.message);
    }

    // Registrar o início da execução
    const { data: execution, error: executionError } = await supabase
      .from("workflow_executions")
      .insert({
        flow_id: flowId,
        status: "running",
        trigger_data: triggerData || {},
      })
      .select("*")
      .single();

    if (executionError) {
      throw new Error("Erro ao registrar execução: " + executionError.message);
    }

    // Executar o fluxo (simulação para demo)
    const executionId = execution.id;
    const executionResult = await executeWorkflow(workflow, triggerData, executionId, supabase);

    // Atualizar o status da execução
    await supabase
      .from("workflow_executions")
      .update({
        status: "completed",
        result: executionResult,
        completed_at: new Date().toISOString(),
      })
      .eq("id", executionId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Fluxo executado com sucesso",
        execution_id: executionId,
        result: executionResult,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro na execução do fluxo:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Função de simulação para executar o fluxo
async function executeWorkflow(
  workflow: Workflow, 
  triggerData: any,
  executionId: string,
  supabase: any
): Promise<any> {
  const { nodes, edges } = workflow;
  
  // Encontrar nós iniciais (triggers)
  const triggerNodes = nodes.filter(node => node.type === "triggerNode");
  
  if (triggerNodes.length === 0) {
    throw new Error("Nenhum nó de gatilho encontrado");
  }
  
  const results: Record<string, any> = {};
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
    
    // Simulação de processamento baseado no tipo de nó
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

// Funções de simulação para cada tipo de nó
function simulateAction(service: string, action: string, inputData: any): any {
  // Simulação de ações
  switch (service) {
    case "email":
      return {
        success: true,
        action: "Enviou email",
        to: inputData.email || "destinatario@exemplo.com",
        subject: "Assunto do email",
        data: inputData
      };
    
    case "whatsapp":
      return {
        success: true,
        action: "Enviou mensagem WhatsApp",
        to: inputData.phone || "+5511999999999",
        message: "Conteúdo da mensagem",
        data: inputData
      };
    
    case "database":
      return {
        success: true,
        action: "Atualizou registro",
        table: "users",
        id: inputData.id || "123",
        fields: { updated: true },
        data: inputData
      };
    
    default:
      return {
        success: true,
        action: `Executou ${action} em ${service}`,
        data: inputData
      };
  }
}

function simulateCondition(action: string, inputData: any): any {
  // Simulação de condições
  if (action === "filter") {
    // Simular alguma lógica de filtro
    const result = Math.random() > 0.5;
    return {
      condition: "filter",
      result,
      data: inputData
    };
  }
  
  if (action === "errorCheck") {
    // Verificar se há erro nos dados de entrada
    const hasError = inputData.error !== undefined;
    return {
      condition: "errorCheck",
      result: !hasError,
      data: inputData
    };
  }
  
  return {
    condition: action,
    result: true,
    data: inputData
  };
}
