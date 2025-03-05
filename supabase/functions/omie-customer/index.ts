
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Verificar se é uma requisição OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Erro ao processar JSON do request:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Formato de requisição inválido' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { user_id, profile } = requestData;
    
    if (!user_id && !profile) {
      throw new Error('ID do usuário ou perfil não fornecido')
    }

    console.log('Recebida solicitação para sincronizar usuário:', user_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const omieAppKey = Deno.env.get('OMIE_APP_KEY')
    const omieAppSecret = Deno.env.get('OMIE_APP_SECRET')

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas')
      throw new Error('Variáveis de ambiente do Supabase não configuradas')
    }

    if (!omieAppKey || !omieAppSecret) {
      console.error('Variáveis de ambiente do OMIE não configuradas')
      throw new Error('Variáveis de ambiente do OMIE não configuradas')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Cliente Supabase criado com sucesso')

    // Se apenas o user_id foi fornecido, buscar o perfil
    let customerProfile = profile
    if (!profile && user_id) {
      console.log('Buscando perfil para o user_id:', user_id)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        throw error
      }
      if (!data) {
        console.error('Perfil não encontrado para o ID:', user_id)
        throw new Error('Perfil não encontrado')
      }
      
      customerProfile = data
      console.log('Perfil encontrado:', customerProfile)
    }

    // Verificar se já existe código OMIE
    if (customerProfile.omie_code) {
      console.log(`Cliente já possui código OMIE: ${customerProfile.omie_code}`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Cliente já sincronizado', 
          omie_code: customerProfile.omie_code 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Preparar dados para envio ao OMIE
    const cpfCnpj = customerProfile.pessoa_fisica ? customerProfile.cpf : customerProfile.cnpj
    
    if (!cpfCnpj) {
      console.error('CPF/CNPJ não informado para o usuário:', user_id)
      console.error('Dados do perfil:', JSON.stringify(customerProfile, null, 2))
      throw new Error('CPF/CNPJ não informado')
    }

    // Extrair DDD e número do telefone (se disponível)
    let telefone1_ddd = ""
    let telefone1_numero = ""
    
    if (customerProfile.phone) {
      // Limpar formatação do telefone para extrair DDD e número
      const phoneClean = customerProfile.phone.replace(/\D/g, '')
      
      if (phoneClean.length >= 2) {
        telefone1_ddd = phoneClean.substring(0, 2)
        telefone1_numero = phoneClean.substring(2)
      } else {
        telefone1_numero = phoneClean
      }
    }

    const omieCustomer = {
      call: "UpsertClient",
      app_key: omieAppKey,
      app_secret: omieAppSecret,
      param: [{
        codigo_cliente_integracao: customerProfile.id,
        email: customerProfile.email,
        razao_social: customerProfile.full_name || "Cliente sem nome",
        nome_fantasia: customerProfile.nome_fantasia || customerProfile.full_name || "Cliente sem nome",
        cnpj_cpf: cpfCnpj,
        telefone1_ddd: telefone1_ddd,
        telefone1_numero: telefone1_numero,
        endereco: customerProfile.address || "",
        endereco_numero: customerProfile.endereco_numero || "S/N",
        complemento: customerProfile.complemento || "",
        bairro: customerProfile.neighborhood || "",
        estado: customerProfile.state || "",
        cidade: customerProfile.city || "",
        cep: customerProfile.zip_code || "",
        pessoa_fisica: customerProfile.pessoa_fisica ? "S" : "N",
        contribuinte: customerProfile.contribuinte || "2",
        optante_simples_nacional: customerProfile.optante_simples_nacional ? "S" : "N",
        inativo: customerProfile.inativo ? "S" : "N",
        tipo_atividade: customerProfile.tipo_atividade || "0",
        exterior: customerProfile.exterior ? "S" : "N",
        bloqueado: customerProfile.bloqueado ? "S" : "N"
      }]
    }

    console.log('Enviando cliente para o OMIE:', JSON.stringify(omieCustomer, null, 2))

    // Enviar para OMIE
    try {
      const omieResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(omieCustomer)
      })

      // Verificar se a resposta é JSON antes de chamar .json()
      const contentType = omieResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await omieResponse.text();
        console.error('Resposta não-JSON do OMIE:', text);
        throw new Error(`Resposta inesperada do Omie: ${text.substring(0, 100)}...`);
      }

      const omieResult = await omieResponse.json()
      console.log('Resposta do OMIE:', omieResult)

      if (omieResult.faultstring) {
        console.error('Erro do OMIE:', omieResult.faultstring)
        throw new Error(`Erro do OMIE: ${omieResult.faultstring}`)
      }

      // Atualizar usuário com o código do OMIE
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          omie_code: omieResult.codigo_cliente_omie,
          omie_sync: true 
        })
        .eq('id', customerProfile.id)

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError)
        throw updateError
      }

      console.log('Perfil atualizado com sucesso. Código Omie:', omieResult.codigo_cliente_omie)

      return new Response(
        JSON.stringify({ 
          success: true, 
          omie_code: omieResult.codigo_cliente_omie 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (omieError) {
      console.error('Erro ao comunicar com o OMIE:', omieError)
      throw new Error(`Erro ao comunicar com o OMIE: ${omieError.message || 'Erro desconhecido'}`)
    }

  } catch (error) {
    console.error('Erro:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Erro desconhecido' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
