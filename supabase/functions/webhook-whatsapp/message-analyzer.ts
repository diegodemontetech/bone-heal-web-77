
import { GeminiAnalysisResult } from '../_shared/types.ts';

// Analisa a mensagem usando Gemini API
export async function analyzeMessageWithGemini(
  geminiApiKey: string,
  message: string
): Promise<GeminiAnalysisResult | null> {
  try {
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é Sueli, assistente virtual premium especializada em atendimento para dentistas e profissionais odontológicos. 
            Você valoriza a cordialidade e oferece informações precisas sobre produtos odontológicos premium da Bone Heal. 
            Responda de forma rápida, amigável e técnica.
            
            Analise a seguinte mensagem do cliente: "${message}"
            
            Forneça:
            1. Uma resposta curta, cordial e profissional (máximo 3 parágrafos)
            2. Classifique a intenção do cliente como: Curiosidade, Intenção de Compra, Orçamento ou Dúvida Técnica
            3. Indique se o cliente deve ser transferido para um atendente humano (true/false)
            
            Formato da resposta:
            {
              "resposta": "Sua resposta aqui",
              "intencao": "Curiosidade/Intenção de Compra/Orçamento/Dúvida Técnica",
              "transferir": true/false
            }`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      })
    });
    
    const geminiData = await geminiResponse.json();
    
    if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content) {
      const textContent = geminiData.candidates[0].content.parts[0].text;
      
      try {
        // Extrair o JSON da resposta
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Erro ao processar resposta do Gemini:', parseError);
      }
    }
  } catch (aiError) {
    console.error('Erro ao consultar Gemini API:', aiError);
  }
  
  return null;
}
