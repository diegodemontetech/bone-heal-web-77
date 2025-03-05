
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log('Fetching content from URL:', url);

    if (!url) {
      throw new Error('URL is required');
    }

    // Fetch the content from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    
    const htmlContent = await response.text();
    console.log('Raw HTML content length:', htmlContent.length);

    // Aggressive cleaning of the HTML content to avoid injection issues
    const cleanContent = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ') // Remove script tags
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')   // Remove style tags
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 5000); // Limit input size to avoid token limits

    console.log('Cleaned content length:', cleanContent.length);
    console.log('Processing content with Gemini');
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content using Gemini with a structured prompt
    const prompt = `
      Você é um redator profissional. Leia o artigo a seguir e crie uma nova versão dele:
      
      Diretrizes importantes:
      1. O conteúdo deve ter entre 800 e 1.500 palavras
      2. Seja detalhado o suficiente para cobrir o assunto completamente, mas não excessivamente longo
      3. Parafraseie o conteúdo para torná-lo único, mantendo as informações principais
      4. Crie um título conciso que capture o ponto principal
      5. Escreva um breve resumo (2-3 frases)
      6. Gere tags relevantes (separadas por vírgula)
      7. MUITO IMPORTANTE: Se o conteúdo estiver em qualquer idioma que não seja o português (PT-BR), traduza tudo para o português (PT-BR)
      
      Retorne APENAS um objeto JSON válido com esta estrutura exata (nenhum texto adicional):
      {
        "title": "O título",
        "summary": "O resumo",
        "content": "O conteúdo completo",
        "tags": "tag1, tag2, tag3"
      }

      Aqui está o artigo para processar:
      ${cleanContent}
    `;

    const result = await model.generateContent(prompt);
    const response_text = result.response.text();
    
    console.log('Generated content successfully');
    
    // Extrair e validar o JSON da resposta
    try {
      // Primeiro, tentar encontrar o padrão JSON na resposta
      const jsonMatch = response_text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Não foi possível encontrar um JSON válido na resposta');
      }
      
      const jsonString = jsonMatch[0];
      const generatedContent = JSON.parse(jsonString);
      
      // Verificar se o JSON tem a estrutura esperada
      if (!generatedContent.title || !generatedContent.content) {
        throw new Error('O JSON gerado não contém os campos necessários');
      }
      
      return new Response(JSON.stringify(generatedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (jsonError) {
      console.error('Erro ao processar JSON:', jsonError);
      
      // Se falhar, fazer uma tentativa mais agressiva de parsing
      try {
        // Limpar e construir um JSON manualmente
        let title = response_text.match(/["']title["']\s*:\s*["']([^"']+)["']/i)?.[1] || "Título gerado";
        let summary = response_text.match(/["']summary["']\s*:\s*["']([^"']+)["']/i)?.[1] || "Resumo gerado automaticamente.";
        let content = response_text.match(/["']content["']\s*:\s*["']([^"']+)["']/i)?.[1] || 
                     response_text.replace(/[{}"']/g, '').substring(0, 1000);
        let tags = response_text.match(/["']tags["']\s*:\s*["']([^"']+)["']/i)?.[1] || "notícia, gerada, automaticamente";
        
        const fallbackContent = {
          title,
          summary,
          content,
          tags
        };
        
        return new Response(JSON.stringify(fallbackContent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (fallbackError) {
        throw new Error(`Falha completa no parsing do JSON: ${fallbackError.message}`);
      }
    }
  } catch (error) {
    console.error('Erro na função generate-news:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || 'Sem detalhes adicionais'
      }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
