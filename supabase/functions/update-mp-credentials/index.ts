
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { corsHeaders } from "../_shared/cors.ts"

interface CredentialsRequest {
  accessToken: string;
  publicKey: string;
}

interface CredentialsResponse {
  success: boolean;
  message: string;
  error?: string;
}

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variáveis de ambiente do Supabase não configuradas corretamente")
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Extrair credenciais do body
    const { accessToken, publicKey } = await req.json() as CredentialsRequest
    
    if (!accessToken || !publicKey) {
      throw new Error("Token de acesso e chave pública são obrigatórios")
    }
    
    console.log("Atualizando credenciais do Mercado Pago")
    
    // Armazenar credenciais na tabela de configurações do sistema
    const { error: insertError } = await supabase
      .from('system_settings')
      .upsert([
        {
          key: 'MP_ACCESS_TOKEN',
          value: accessToken,
          updated_at: new Date().toISOString()
        },
        {
          key: 'MP_PUBLIC_KEY',
          value: publicKey,
          updated_at: new Date().toISOString()
        }
      ])
      
    if (insertError) {
      console.error("Erro ao armazenar credenciais:", insertError)
      throw new Error(`Erro ao armazenar credenciais: ${insertError.message}`)
    }
    
    // Registrar evento de atualização no log
    const { error: logError } = await supabase
      .from('system_logs')
      .insert({
        type: 'credentials_update',
        source: 'mercadopago',
        status: 'success',
        details: `Credenciais do Mercado Pago atualizadas em ${new Date().toISOString()}`
      })
    
    if (logError) {
      console.warn("Aviso: Não foi possível registrar o log:", logError.message)
    }
    
    // Retornar resposta de sucesso
    const response: CredentialsResponse = {
      success: true,
      message: "Credenciais do Mercado Pago atualizadas com sucesso"
    }
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
    
  } catch (error) {
    console.error("Erro ao atualizar credenciais:", error instanceof Error ? error.message : String(error))
    
    const response: CredentialsResponse = {
      success: false,
      message: "Falha ao atualizar credenciais do Mercado Pago",
      error: error instanceof Error ? error.message : String(error)
    }
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
