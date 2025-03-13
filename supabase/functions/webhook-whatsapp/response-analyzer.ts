
import { GeminiAnalysisResult } from '../_shared/types.ts';

/**
 * Analisa a resposta da API do Gemini e extrai os dados estruturados
 * @param geminiData Dados brutos retornados pela API do Gemini
 * @returns Objeto formatado com os dados da análise ou null se houver erro
 */
export function parseGeminiResponse(geminiData: any): GeminiAnalysisResult | null {
  try {
    if (!geminiData || !geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
      console.error("Formato de resposta inválido da API Gemini");
      return null;
    }
    
    const textContent = geminiData.candidates[0].content.parts[0].text;
    
    // Extrair o JSON da resposta
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Não foi possível encontrar JSON na resposta:", textContent);
      return null;
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Validar os campos obrigatórios
    if (!parsedResponse.resposta || !parsedResponse.intencao || parsedResponse.transferir === undefined) {
      console.error("Resposta incompleta da API Gemini:", parsedResponse);
      return null;
    }
    
    return {
      resposta: parsedResponse.resposta,
      intencao: parsedResponse.intencao,
      transferir: Boolean(parsedResponse.transferir)
    };
  } catch (parseError) {
    console.error('Erro ao processar resposta do Gemini:', parseError);
    return null;
  }
}

/**
 * Gera um fallback para quando a análise falha
 * @param message Mensagem original que falhou na análise
 * @returns Objeto com análise padrão
 */
export function generateFallbackAnalysis(message: string): GeminiAnalysisResult {
  return {
    resposta: "Obrigada por entrar em contato com a Bone Heal. Um de nossos especialistas em produtos odontológicos irá atendê-lo em breve para responder sua pergunta com mais detalhes.",
    intencao: "Dúvida Técnica",
    transferir: true
  };
}
