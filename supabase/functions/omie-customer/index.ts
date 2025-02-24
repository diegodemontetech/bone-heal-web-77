
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the profile ID from the request
    const { profile_id }: OmieCustomerRequest = await req.json()
    
    // Fetch the profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', profile_id)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Prepare Omie customer data
    const customerData = {
      call: "IncluirCliente",
      app_key: OMIE_APP_KEY,
      app_secret: OMIE_APP_SECRET,
      param: [{
        codigo_cliente_integracao: profile.id,
        razao_social: profile.full_name,
        cnpj_cpf: profile.cnpj || profile.cpf,
        nome_fantasia: profile.full_name,
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

    // Send request to Omie API
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    })

    const omieResult = await omieResponse.json()

    // Log the result
    console.log('Omie API Response:', omieResult)

    if (!omieResponse.ok) {
      throw new Error('Failed to create customer in Omie')
    }

    // Update the profile with Omie code
    if (omieResult.codigo_cliente_omie) {
      await supabaseClient
        .from('profiles')
        .update({ 
          omie_code: omieResult.codigo_cliente_omie.toString(),
          omie_sync: true 
        })
        .eq('id', profile_id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        omie_code: omieResult.codigo_cliente_omie,
        message: 'Customer created successfully in Omie'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
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
