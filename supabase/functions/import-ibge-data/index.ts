
import { createClient } from '@supabase/supabase-js'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const IBGE_ESTADOS_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
const IBGE_MUNICIPIOS_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    console.log("Iniciando importação dos estados...")
    
    // Fetch states from IBGE API
    const estadosResponse = await fetch(IBGE_ESTADOS_URL)
    const estados = await estadosResponse.json()
    
    // Map states to our table format
    const estadosFormatados = estados.map((estado: any) => ({
      id: estado.id,
      name: estado.nome,
      ibge_code: estado.id.toString(),
      uf: estado.sigla
    }))

    // Insert states using upsert to avoid duplicates
    const { error: estadosError } = await supabaseClient
      .from('ibge_states')
      .upsert(estadosFormatados, { 
        onConflict: 'id',
      })

    if (estadosError) {
      throw new Error(`Erro ao inserir estados: ${estadosError.message}`)
    }

    console.log(`${estadosFormatados.length} estados importados com sucesso.`)

    console.log("Iniciando importação dos municípios...")
    
    // Fetch cities from IBGE API
    const municipiosResponse = await fetch(IBGE_MUNICIPIOS_URL)
    const municipios = await municipiosResponse.json()

    // Map cities to our table format
    const municipiosFormatados = municipios.map((municipio: any) => ({
      id: municipio.id,
      name: municipio.nome,
      state_id: municipio.microrregiao.mesorregiao.UF.id,
      ibge_code: municipio.id.toString()
    }))

    // Insert cities using upsert to avoid duplicates
    const { error: municipiosError } = await supabaseClient
      .from('ibge_cities')
      .upsert(municipiosFormatados, {
        onConflict: 'id'
      })

    if (municipiosError) {
      throw new Error(`Erro ao inserir municípios: ${municipiosError.message}`)
    }

    console.log(`${municipiosFormatados.length} municípios importados com sucesso.`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Dados do IBGE importados com sucesso',
        states: estadosFormatados.length,
        cities: municipiosFormatados.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Erro durante a importação:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
