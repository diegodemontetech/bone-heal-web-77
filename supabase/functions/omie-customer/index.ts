import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OMIE_API_URL = 'https://app.omie.com.br/api/v1/geral/clientes/'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { profile_id } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get profile details from database
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', profile_id)
      .single()

    if (profileError) throw profileError
    if (!profile) throw new Error('Profile not found')

    // Create customer in OMIE
    const omieCustomer = {
      codigo_cliente_integracao: profile.id,
      razao_social: profile.full_name,
      cnpj_cpf: profile.cnpj || '',
      telefone1_numero: profile.phone || '',
      endereco: profile.address || '',
      endereco_numero: "S/N",
      bairro: profile.neighborhood || '',
      estado: profile.state || '',
      cidade: profile.city || '',
      cep: profile.zip_code || '',
      contribuinte: "2", // Contribuinte ICMS: 1 - Sim, 2 - Não
      pessoa_fisica: "S",
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

    return new Response(
      JSON.stringify({ success: true, codigo_cliente_omie: omieData.codigo_cliente_omie }),
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