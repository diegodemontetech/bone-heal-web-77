
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verificar se temos o token de acesso do Hugging Face
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN não configurado no ambiente');
    }

    // Parse the request body
    let prompt;
    try {
      const body = await req.json();
      prompt = body.prompt;

      if (!prompt) {
        throw new Error('Prompt não fornecido na requisição');
      }
    } catch (parseError) {
      console.error('Erro ao analisar corpo da requisição:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Corpo da requisição inválido. Esperado formato JSON com campo "prompt".' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log('Gerando imagem para prompt:', prompt);

    // Inicializar o cliente do Hugging Face com o token
    const hf = new HfInference(hfToken);

    // Gerar a imagem usando o modelo especificado
    const image = await hf.textToImage({
      inputs: prompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    });

    // Converter a imagem para base64
    const arrayBuffer = await image.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    console.log('Imagem gerada com sucesso');
    
    // Retornar a imagem como base64
    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro desconhecido na geração de imagem',
        details: error.stack || 'Sem detalhes adicionais'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
