
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  })
}

async function handleRequest(req: Request) {
  try {
    const { profile_id } = await req.json()

    if (!profile_id) {
      throw new Error('Profile ID is required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profile_id)
      .single()

    if (profileError) {
      throw profileError
    }

    if (!profile) {
      throw new Error('Profile not found')
    }

    // OMIE API credentials
    const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY')
    const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET')

    if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
      throw new Error('Missing OMIE credentials')
    }

    // Prepare customer data for OMIE
    const customerData = {
      call: 'IncluirCliente',
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      param: [{
        razao_social: profile.full_name,
        cnpj_cpf: profile.cnpj || profile.cpf,
        email: profile.email,
        telefone1_ddd: profile.phone?.substring(0, 2) || '',
        telefone1_numero: profile.phone?.substring(2) || '',
        endereco: profile.address,
        endereco_numero: 'S/N',
        bairro: profile.neighborhood,
        estado: profile.state,
        cidade: profile.city,
        cep: profile.zip_code,
        codigo_cliente_integracao: profile.id,
        inscricao_estadual: profile.cro || '',
      }]
    }

    console.log('Sending customer data to OMIE:', JSON.stringify(customerData))

    // Send request to OMIE API
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    })

    const omieData = await omieResponse.json()

    if (!omieResponse.ok) {
      throw new Error(`OMIE API error: ${JSON.stringify(omieData)}`)
    }

    console.log('OMIE response:', omieData)

    // Update profile with OMIE code
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        omie_code: omieData.codigo_cliente_omie?.toString(),
        omie_sync: true
      })
      .eq('id', profile_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Customer successfully created in OMIE',
        omie_code: omieData.codigo_cliente_omie 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  if (req.method === 'POST') {
    return handleRequest(req)
  }

  return new Response('Method not allowed', {
    headers: corsHeaders,
    status: 405
  })
})
