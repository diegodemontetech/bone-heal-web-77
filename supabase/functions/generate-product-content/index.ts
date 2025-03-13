
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

// Cache para resposta de produtos, para evitar chamadas redundantes
const productDataCache = new Map();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { omieCode, productName, contentType } = await req.json();
    
    if (!omieCode) {
      throw new Error("Código Omie não informado");
    }
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY não configurada");
    }
    
    console.log(`Gerando ${contentType || 'conteúdo'} para produto: ${omieCode} - ${productName}`);
    
    // Verificar cache para não repetir chamadas à API
    const cacheKey = `${omieCode}-${contentType || 'all'}`;
    if (productDataCache.has(cacheKey)) {
      console.log("Usando dados em cache");
      return new Response(
        JSON.stringify(productDataCache.get(cacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Definir o prompt dependendo do tipo de conteúdo solicitado
    let prompt;
    
    if (contentType === 'technical_details') {
      prompt = `Você é um especialista em produtos médicos e odontológicos da Bone Heal. 
      Gere detalhes técnicos detalhados para o produto com código ${omieCode} e nome "${productName || 'sem nome'}".
      
      A Bone Heal é especializada em biomateriais e produtos para enxertos ósseos, regeneração tecidual e procedimentos odontológicos avançados.
      
      Crie um JSON estruturado com as seguintes seções:
      1. dimensions (dimensões): weight, height, width, length
      2. materials (materiais): material, composition
      3. usage (uso): indication, contraindication, instructions
      4. regulatory (regulatório): registration, classification
      
      Formato de resposta: Apenas JSON com os campos acima.
      Exemplo de formato (preencha com informações realistas para produtos odontológicos):
      {
        "dimensions": {
          "weight": "10g",
          "height": "5cm",
          "width": "2cm",
          "length": "8cm"
        },
        "materials": {
          "material": "Liga de titânio",
          "composition": "Ti6Al4V"
        },
        "usage": {
          "indication": "Uso em procedimentos ortopédicos",
          "contraindication": "Pacientes com alergia a metais",
          "instructions": "Esterilizar antes do uso"
        },
        "regulatory": {
          "registration": "10380460001",
          "classification": "Classe III"
        }
      }`;
    } else {
      // Prompt padrão para descrições
      prompt = `Você é um especialista em produtos médicos e odontológicos da Bone Heal.
      Crie uma descrição curta (máximo 100 palavras) e uma descrição longa (250-300 palavras) para o produto com código ${omieCode} e nome "${productName || 'sem nome'}".
      
      A Bone Heal é especializada em biomateriais e produtos para enxertos ósseos, regeneração tecidual e procedimentos odontológicos avançados.
      
      A descrição curta deve ser objetiva e destacar os principais benefícios.
      A descrição longa deve ser detalhada, incluindo características, diferenciais e benefícios.
      
      Formato de resposta: Apenas JSON com os campos "short_description" e "description".
      Exemplo:
      {
        "short_description": "Texto da descrição curta aqui",
        "description": "Texto da descrição longa aqui"
      }`;
    }
    
    try {
      // Chamar a API Gemini
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API Gemini:", errorText);
        throw new Error(`Erro na API Gemini: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.candidates || result.candidates.length === 0) {
        console.error("Resposta vazia da API Gemini:", JSON.stringify(result));
        throw new Error("Resposta vazia da API Gemini");
      }
      
      const textContent = result.candidates[0].content.parts[0].text;
      console.log("Texto gerado:", textContent.substring(0, 100) + "...");
      
      // Extrair o JSON da resposta
      try {
        // Tentar extrair JSON da resposta
        let jsonMatch = textContent.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
          console.error("Formato de resposta inválido, texto completo:", textContent);
          throw new Error("Formato de resposta inválido");
        }
        
        // Parse do JSON
        let parsedContent = JSON.parse(jsonMatch[0]);
        
        // Preparar resposta final baseada no tipo de conteúdo
        let responseData;
        
        if (contentType === 'technical_details') {
          responseData = {
            technical_details: parsedContent
          };
        } else {
          responseData = {
            short_description: parsedContent.short_description,
            description: parsedContent.description
          };
        }
        
        // Guardar no cache
        productDataCache.set(cacheKey, responseData);
        
        // Limitar o tamanho do cache (máximo 50 itens)
        if (productDataCache.size > 50) {
          const firstKey = productDataCache.keys().next().value;
          productDataCache.delete(firstKey);
        }
        
        return new Response(
          JSON.stringify(responseData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON:", parseError);
        console.error("Texto recebido:", textContent);
        throw new Error("Erro ao processar resposta da IA");
      }
    } catch (apiError) {
      console.error("Erro ao chamar API Gemini:", apiError);
      throw apiError;
    }
  } catch (error) {
    console.error("Erro na função:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro desconhecido ao gerar conteúdo" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
