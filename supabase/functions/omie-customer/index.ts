
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY')
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET')

interface OmieCustomerRequest {
  profile_id: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validar chaves Omie
    if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
      throw new Error('Chaves da API Omie não configuradas')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the profile ID from the request
    const { profile_id }: OmieCustomerRequest = await req.json()
    
    // Validar ID do perfil
    if (!profile_id) {
      throw new Error('ID do perfil não fornecido')
    }

    console.log('Iniciando sincronização de cliente Omie para perfil:', profile_id)
    
    // Fetch the profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', profile_id)
      .single()

    if (profileError || !profile) {
      console.error('Erro ao buscar perfil:', profileError)
      throw new Error('Perfil não encontrado')
    }

    console.log('Perfil encontrado:', JSON.stringify(profile, null, 2))

    // Prepare Omie customer data
    const customerData = {
      call: "IncluirCliente",
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      param: [{
        codigo_cliente_integracao: profile.id,
        razao_social: profile.pessoa_fisica ? profile.full_name : profile.razao_social,
        cnpj_cpf: profile.pessoa_fisica ? profile.cpf : profile.cnpj,
        nome_fantasia: profile.pessoa_fisica ? profile.full_name : (profile.nome_fantasia || profile.razao_social),
        telefone1_numero: profile.phone?.replace(/\D/g, '') || "",
        email: profile.email,
        endereco: profile.address || "",
        endereco_numero: profile.endereco_numero || "S/N",
        complemento: profile.complemento || "",
        bairro: profile.neighborhood || "",
        estado: profile.state,
        cidade: profile.city,
        cep: profile.zip_code?.replace(/\D/g, '') || "",
        contribuinte: profile.contribuinte || "2",
        pessoa_fisica: profile.pessoa_fisica ? "S" : "N",
        optante_simples_nacional: profile.optante_simples_nacional ? "S" : "N",
        inativo: profile.inativo ? "S" : "N",
        bloqueado: profile.bloqueado ? "S" : "N",
        exterior: profile.exterior ? "S" : "N",
        tipo_atividade: profile.tipo_atividade || "0",
      }]
    }

    console.log('Dados para Omie:', JSON.stringify(customerData, null, 2))

    // Send request to Omie API
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    })

    if (!omieResponse.ok) {
      const errorText = await omieResponse.text()
      console.error('Resposta de erro Omie:', errorText)
      throw new Error(`Falha na requisição Omie: ${omieResponse.status} ${errorText}`)
    }

    const omieResult = await omieResponse.json()

    // Log the result
    console.log('Resposta Omie API:', JSON.stringify(omieResult, null, 2))

    // Verificar por erros específicos do Omie
    if (omieResult.faultstring) {
      throw new Error(`Erro Omie: ${omieResult.faultstring}`)
    }

    // Update the profile with Omie code
    if (omieResult.codigo_cliente_omie) {
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ 
          omie_code: omieResult.codigo_cliente_omie.toString(),
          omie_sync: true 
        })
        .eq('id', profile_id)

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError)
        throw new Error(`Cliente criado no Omie mas erro ao atualizar perfil: ${updateError.message}`)
      }

      console.log('Perfil atualizado com código Omie:', omieResult.codigo_cliente_omie)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        omie_code: omieResult.codigo_cliente_omie,
        message: 'Cliente criado com sucesso no Omie'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )

  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
