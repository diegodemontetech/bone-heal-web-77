
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OMIE_API_URL = 'https://app.omie.com.br/api/v1/geral/clientes/'
const OMIE_CARACT_API_URL = 'https://app.omie.com.br/api/v1/geral/clientescaract/'
const OMIE_TAG_API_URL = 'https://app.omie.com.br/api/v1/geral/clientetag/'

// Interfaces para tipagem
interface OmieResponse {
  codigo_cliente_omie: number;
  codigo_status?: string;
  descricao_status?: string;
}

interface OmieCaracteristica {
  campo: string;
  conteudo: string;
}

interface OmieTag {
  tag: string;
}

async function incluirCaracteristicasCliente(
  codigo_cliente_omie: number,
  caracteristicas: OmieCaracteristica[],
  appKey: string,
  appSecret: string
) {
  const promises = caracteristicas.map(async (caract) => {
    const requestBody = {
      call: 'IncluirCaractCliente',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        codigo_cliente_omie,
        campo: caract.campo,
        conteudo: caract.conteudo
      }]
    };

    const response = await fetch(OMIE_CARACT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    return response.json();
  });

  return Promise.all(promises);
}

async function incluirTagsCliente(
  codigo_cliente_omie: number,
  tags: OmieTag[],
  appKey: string,
  appSecret: string
) {
  const requestBody = {
    call: 'IncluirTags',
    app_key: appKey,
    app_secret: appSecret,
    param: [{
      nCodCliente: codigo_cliente_omie,
      tags: tags
    }]
  };

  const response = await fetch(OMIE_TAG_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { profile_id } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Busca detalhes do perfil
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', profile_id)
      .single()

    if (profileError) throw profileError
    if (!profile) throw new Error('Profile not found')

    // Cria cliente no OMIE
    const omieCustomer = {
      codigo_cliente_integracao: profile.id,
      razao_social: profile.full_name,
      cnpj_cpf: profile.cnpj || profile.cpf || '',
      telefone1_numero: profile.phone || '',
      endereco: profile.address || '',
      endereco_numero: "S/N",
      bairro: profile.neighborhood || '',
      estado: profile.state || '',
      cidade: profile.city || '',
      cep: profile.zip_code || '',
      contribuinte: "2",
      pessoa_fisica: profile.cpf ? "S" : "N",
      exterior: "N"
    }

    console.log('Creating customer in OMIE:', omieCustomer)

    const omieResponse = await fetch(OMIE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call: 'IncluirCliente',
        app_key: Deno.env.get('OMIE_APP_KEY'),
        app_secret: Deno.env.get('OMIE_APP_SECRET'),
        param: [omieCustomer],
      }),
    })

    const omieData = await omieResponse.json()
    console.log('OMIE response:', omieData)

    if (omieData.faultstring) {
      throw new Error(omieData.faultstring)
    }

    // Adiciona características do cliente
    const caracteristicas: OmieCaracteristica[] = [
      { campo: "ESPECIALIDADE", conteudo: profile.specialty || '' },
      { campo: "CRO", conteudo: profile.cro || '' }
    ]

    await incluirCaracteristicasCliente(
      omieData.codigo_cliente_omie,
      caracteristicas,
      Deno.env.get('OMIE_APP_KEY') || '',
      Deno.env.get('OMIE_APP_SECRET') || ''
    )

    // Adiciona tags
    const tags: OmieTag[] = [
      { tag: profile.contact_type || 'customer' }
    ]

    await incluirTagsCliente(
      omieData.codigo_cliente_omie,
      tags,
      Deno.env.get('OMIE_APP_KEY') || '',
      Deno.env.get('OMIE_APP_SECRET') || ''
    )

    // Atualiza perfil com código Omie
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        omie_code: omieData.codigo_cliente_omie.toString(),
        omie_sync: true 
      })
      .eq('id', profile_id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        success: true, 
        codigo_cliente_omie: omieData.codigo_cliente_omie,
        message: 'Cliente criado com sucesso no Omie incluindo características e tags'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
