
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    console.log("Iniciando teste de conexão com Mercado Pago");
    
    // Configurar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variáveis de ambiente do Supabase não configuradas corretamente");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Buscar credenciais do Mercado Pago do banco de dados
    const { data: settingsData, error: settingsError } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['MP_ACCESS_TOKEN', 'MP_PUBLIC_KEY']);
    
    // Extrair token do banco de dados ou usar o do ambiente
    let access_token = Deno.env.get('MP_ACCESS_TOKEN');
    
    if (settingsData && settingsData.length > 0) {
      const tokenSetting = settingsData.find(s => s.key === 'MP_ACCESS_TOKEN');
      if (tokenSetting && tokenSetting.value) {
        access_token = tokenSetting.value;
        console.log("Usando token do banco de dados");
      }
    }

    if (!access_token) {
      throw new Error("Token do Mercado Pago não configurado");
    }
    
    console.log("Token utilizado: ", access_token.substring(0, 10) + "...");
    
    // Testar API do Mercado Pago buscando os métodos de pagamento disponíveis
    const mpResponse = await fetch("https://api.mercadopago.com/v1/payment_methods", {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });
    
    const responseStatus = mpResponse.status;
    const responseData = await mpResponse.json();
    
    console.log("Resposta da API MP (status):", responseStatus);
    
    // Verificar se a resposta foi bem-sucedida
    if (responseStatus !== 200) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Erro na API do Mercado Pago: ${responseStatus}`,
          data: responseData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Retornamos 200 mesmo com erro da API para facilitar tratamento no frontend
        }
      );
    }
    
    // Log do sucesso
    console.log("Teste de conexão com Mercado Pago bem-sucedido");
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Conexão com Mercado Pago testada com sucesso",
        data: responseData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Erro ao testar conexão com Mercado Pago:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Erro ao testar conexão com Mercado Pago: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error.stack : null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
