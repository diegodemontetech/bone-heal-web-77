import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get active products with stock from Omie
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/geral/produtos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call: 'ListarProdutos',
        app_key: Deno.env.get('OMIE_APP_KEY'),
        app_secret: Deno.env.get('OMIE_APP_SECRET'),
        param: [{
          apenas_importado_api: "N",
          filtrar_apenas_omiepdv: "N",
          inativo: "N",
        }],
      }),
    })

    const omieData = await omieResponse.json()
    
    // Filter products with stock > 0
    const activeProducts = omieData.produto_servico_cadastro
      .filter((product: any) => product.estoque > 0)
      .map((product: any) => ({
        codigo: product.codigo,
        descricao: product.descricao,
        valor_unitario: product.valor_unitario,
        estoque: product.estoque,
      }))

    return new Response(
      JSON.stringify({ 
        success: true, 
        products: activeProducts 
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