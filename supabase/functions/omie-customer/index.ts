
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, profile } = await req.json()
    
    if (!user_id && !profile) {
      throw new Error('ID do usuário ou perfil não fornecido')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const omieAppKey = Deno.env.get('OMIE_APP_KEY')
    const omieAppSecret = Deno.env.get('OMIE_APP_SECRET')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas')
    }

    if (!omieAppKey || !omieAppSecret) {
      throw new Error('Variáveis de ambiente do OMIE não configuradas')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Se apenas o user_id foi fornecido, buscar o perfil
    let customerProfile = profile
    if (!profile && user_id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Perfil não encontrado')
      
      customerProfile = data
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
      throw new Error('CPF/CNPJ não informado')
    }

    const telefone1_ddd = customerProfile.phone?.substring(0, 2) || ""
    const telefone1_numero = customerProfile.phone?.substring(2) || ""

    const omieCustomer = {
      call: "UpsertClient",
      app_key: omieAppKey,
      app_secret: omieAppSecret,
      param: [{
        codigo_cliente_integracao: customerProfile.id,
        email: customerProfile.email,
        razao_social: customerProfile.full_name,
        nome_fantasia: customerProfile.nome_fantasia || customerProfile.full_name,
        cnpj_cpf: cpfCnpj,
        telefone1_ddd: telefone1_ddd,
        telefone1_numero: telefone1_numero,
        endereco: customerProfile.address,
        endereco_numero: customerProfile.endereco_numero || "S/N",
        complemento: customerProfile.complemento || "",
        bairro: customerProfile.neighborhood,
        estado: customerProfile.state,
        cidade: customerProfile.city,
        cep: customerProfile.zip_code,
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
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(omieCustomer)
    })

    const omieResult = await omieResponse.json()
    console.log('Resposta do OMIE:', omieResult)

    if (omieResult.faultstring) {
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

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        success: true, 
        omie_code: omieResult.codigo_cliente_omie 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Erro desconhecido' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
