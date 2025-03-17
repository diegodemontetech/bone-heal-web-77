import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { corsHeaders } from "../_shared/cors.ts"

interface TestResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp?: string;
}

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Iniciando teste de conexão com Mercado Pago")
    
    // Verificar se é ambiente de desenvolvimento
    const isDevelopment = req.headers.get('x-environment') === 'development'
    
    // Se for ambiente de desenvolvimento, simular resposta
    if (isDevelopment) {
      console.log("Ambiente de desenvolvimento detectado, simulando resposta")
      
      const response: TestResponse = {
        success: true,
        message: "Conexão simulada com o Mercado Pago realizada com sucesso",
        data: {
          environment: "development",
          simulated: true,
          timestamp: new Date().toISOString()
        }
      }
      
      return new Response(
        JSON.stringify(response),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Variáveis de ambiente do Supabase não configuradas corretamente")
      
      const errorResponse: TestResponse = {
        success: false,
        message: "Erro de configuração do servidor",
        error: "Variáveis de ambiente necessárias para o funcionamento do Supabase não estão configuradas"
      }
      
      return new Response(
        JSON.stringify(errorResponse),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Configurar API do Mercado Pago
    const mercadoPagoUrl = "https://api.mercadopago.com/v1"
    const access_token = Deno.env.get('MP_ACCESS_TOKEN')
    
    if (!access_token) {
      console.error("Token do Mercado Pago não configurado")
      
      const errorResponse: TestResponse = {
        success: false,
        message: "Erro de configuração do Mercado Pago",
        error: "Token de acesso do Mercado Pago não está configurado"
      }
      
      return new Response(
        JSON.stringify(errorResponse),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
    
    // Testar conexão com o endpoint de pagamentos do Mercado Pago
    let mpResponse;
    try {
      mpResponse = await fetch(`${mercadoPagoUrl}/payment_methods`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!mpResponse.ok) {
        const errorText = await mpResponse.text()
        console.error(`Erro na resposta do Mercado Pago: ${mpResponse.status} - ${errorText}`)
        
        const errorResponse: TestResponse = {
          success: false,
          message: `Erro ao conectar com o Mercado Pago (Status: ${mpResponse.status})`,
          error: errorText
        }
        
        return new Response(
          JSON.stringify(errorResponse),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        )
      }
    } catch (fetchError) {
      console.error("Erro ao fazer a requisição para o Mercado Pago:", fetchError)
      
      const errorResponse: TestResponse = {
        success: false,
        message: "Erro de conexão com o Mercado Pago",
        error: fetchError instanceof Error ? fetchError.message : String(fetchError)
      }
      
      return new Response(
        JSON.stringify(errorResponse),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
    
    const paymentMethods = await mpResponse.json()
    
    // Registrar o resultado do teste no log
    const logEntry = {
      type: 'test',
      source: 'mercadopago',
      status: 'success',
      details: `Conexão realizada em ${new Date().toISOString()}`,
      test_result: 'payment_methods_fetched'
    }
    
    const { error: logError } = await supabase
      .from('system_logs')
      .insert(logEntry)
      
    if (logError) {
      console.warn(`Aviso: Não foi possível registrar o log: ${logError.message}`)
    }
    
    // Retornar resposta de sucesso
    const response: TestResponse = {
      success: true,
      message: "Conexão com o Mercado Pago realizada com sucesso",
      data: {
        paymentMethods: paymentMethods.slice(0, 5), // Retornar apenas os primeiros 5 métodos para não sobrecarregar a resposta
        environment: "production",
        timestamp: new Date().toISOString()
      }
    }
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error(`Erro ao testar conexão com Mercado Pago:`, error instanceof Error ? error.message : String(error))
    
    const response: TestResponse = {
      success: false,
      message: "Falha ao testar conexão com o Mercado Pago",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
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
