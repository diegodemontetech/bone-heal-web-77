
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { corsHeaders } from "./cors.ts";
import { ExecuteRequest } from "./types.ts";
import { executeWorkflow } from "./workflow-executor.ts";

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

    // Executar o fluxo
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
