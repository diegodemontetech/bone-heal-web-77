
import { GeminiAnalysisResult } from '../_shared/types.ts';
import { callGeminiAPI } from './gemini-api-service.ts';
import { parseGeminiResponse, generateFallbackAnalysis } from './response-analyzer.ts';

/**
 * Analisa a mensagem usando Gemini API
 * Função principal que coordena o fluxo de análise
 * @param geminiApiKey Chave de API do Gemini
 * @param message Mensagem a ser analisada
 * @returns Resultado da análise ou null em caso de falha total
 */
export async function analyzeMessageWithGemini(
  geminiApiKey: string,
  message: string
): Promise<GeminiAnalysisResult | null> {
  try {
    // 1. Chamar a API do Gemini
    const geminiData = await callGeminiAPI(geminiApiKey, message);
    
    // 2. Se houver resposta, analisar
    if (geminiData) {
      const parsedResult = parseGeminiResponse(geminiData);
      
      // 3. Se a análise for bem-sucedida, retornar o resultado
      if (parsedResult) {
        return parsedResult;
      }
    }
    
    // 4. Em caso de falha na chamada ou na análise, gerar resposta padrão
    console.warn("Usando análise padrão devido a falha na API ou processamento");
    return generateFallbackAnalysis(message);
  } catch (error) {
    console.error('Erro no processo de análise de mensagem:', error);
    return null;
  }
}
