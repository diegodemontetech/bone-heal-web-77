
/**
 * Serviço para interação com a API do Gemini
 */

/**
 * Realiza a chamada à API do Gemini para análise de mensagem
 * @param geminiApiKey Chave de API do Gemini
 * @param message Mensagem a ser analisada
 * @returns Objeto com a resposta bruta da API ou null em caso de erro
 */
export async function callGeminiAPI(
  geminiApiKey: string,
  message: string
): Promise<any | null> {
  try {
    console.log("Chamando Gemini API para analisar mensagem");
    
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
    
    if (!geminiData || !geminiData.candidates || geminiData.candidates.length === 0) {
      console.error("Resposta inválida da API Gemini:", geminiData);
      return null;
    }
    
    return geminiData;
  } catch (error) {
    console.error('Erro ao consultar Gemini API:', error);
    return null;
  }
}
