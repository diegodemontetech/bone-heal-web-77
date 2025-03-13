
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
    const { omieCode, productName } = await req.json();
    console.log(`Gerando conteúdo para produto ${productName} (Código Omie: ${omieCode})`);

    if (!omieCode) {
      throw new Error('Código Omie é obrigatório');
    }

    // Inicializar Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Gerar conteúdo usando Gemini com um prompt estruturado
    const prompt = `
      Você é um especialista em produtos odontológicos, especialmente biomateriais da Bone Heal.
      
      Com base no código Omie "${omieCode}" e no nome do produto "${productName}", gere:
      
      1. Uma descrição curta (2-3 frases) que destaque os principais benefícios
      2. Uma descrição completa (3-4 parágrafos) detalhando composição, benefícios e indicações
      3. Detalhes técnicos formatados como um objeto JSON com as seguintes propriedades:
         - composição
         - indicações
         - contraindicações
         - modo_de_uso
         - armazenamento
         - peso (em gramas)
      
      Retorne APENAS um objeto JSON com esta estrutura exata (nenhum texto adicional):
      {
        "short_description": "Descrição curta aqui",
        "description": "Descrição completa aqui",
        "technical_details": {
          "composição": "Lista dos componentes",
          "indicações": "Casos onde o produto é indicado",
          "contraindicações": "Situações onde não deve ser usado",
          "modo_de_uso": "Como utilizar o produto",
          "armazenamento": "Como armazenar",
          "peso": "XX"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response_text = result.response.text();
    
    console.log('Conteúdo gerado com sucesso');
    
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
      if (!generatedContent.short_description || !generatedContent.description) {
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
        const shortDesc = response_text.match(/["']short_description["']\s*:\s*["']([^"']+)["']/i)?.[1] || 
                         "Biomaterial odontológico de alta qualidade para regeneração óssea.";
        const fullDesc = response_text.match(/["']description["']\s*:\s*["']([^"']+)["']/i)?.[1] || 
                        "Produto de alta qualidade para procedimentos odontológicos regenerativos.";
        
        const fallbackContent = {
          short_description: shortDesc,
          description: fullDesc,
          technical_details: {
            composição: "Biomaterial com base em hidroxiapatita",
            indicações: "Procedimentos regenerativos",
            contraindicações: "Alergia a algum dos componentes",
            modo_de_uso: "Aplicar conforme orientação do profissional",
            armazenamento: "Local seco e arejado",
            peso: "0.2"
          }
        };
        
        return new Response(JSON.stringify(fallbackContent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (fallbackError) {
        throw new Error(`Falha completa no parsing do JSON: ${fallbackError.message}`);
      }
    }
  } catch (error) {
    console.error('Erro na função generate-product-content:', error);
    
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
