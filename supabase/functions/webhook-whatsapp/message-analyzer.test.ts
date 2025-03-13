
// Testes de unidade para o analisador de mensagens

// Mock para a API do Gemini
const mockGeminiData = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: `Aqui está minha análise:
            
            {
              "resposta": "Olá! Agradecemos seu interesse nos implantes da Bone Heal. Nossos produtos são de alta qualidade e possuem certificação premium. Para informações detalhadas sobre preços e opções disponíveis, posso conectá-lo a um de nossos consultores.",
              "intencao": "Orçamento",
              "transferir": true
            }`
          }
        ]
      }
    }
  ]
};

// Teste da função parseGeminiResponse
Deno.test("parseGeminiResponse - deve extrair dados corretamente", () => {
  const { parseGeminiResponse } = await import('./response-analyzer.ts');
  
  const result = parseGeminiResponse(mockGeminiData);
  
  if (!result) {
    throw new Error("Resultado não deveria ser nulo");
  }
  
  // Verificar se os campos foram extraídos corretamente
  if (result.intencao !== "Orçamento") {
    throw new Error(`Intenção incorreta: ${result.intencao}`);
  }
  
  if (result.transferir !== true) {
    throw new Error(`Valor de transferir incorreto: ${result.transferir}`);
  }
  
  if (!result.resposta.includes("Bone Heal")) {
    throw new Error(`Resposta incorreta: ${result.resposta}`);
  }
});

// Teste da função generateFallbackAnalysis
Deno.test("generateFallbackAnalysis - deve retornar resposta padrão", () => {
  const { generateFallbackAnalysis } = await import('./response-analyzer.ts');
  
  const result = generateFallbackAnalysis("Qualquer mensagem");
  
  if (!result.resposta) {
    throw new Error("Resposta padrão não deveria ser vazia");
  }
  
  if (!result.transferir) {
    throw new Error("Resposta padrão deveria indicar transferência para humano");
  }
});

// Teste para verificar tratamento de erro
Deno.test("parseGeminiResponse - deve lidar com resposta inválida", () => {
  const { parseGeminiResponse } = await import('./response-analyzer.ts');
  
  const invalidData = {
    candidates: [
      {
        content: {
          parts: [
            {
              text: "Resposta sem formato JSON"
            }
          ]
        }
      }
    ]
  };
  
  const result = parseGeminiResponse(invalidData);
  
  if (result !== null) {
    throw new Error("Deveria retornar null para resposta inválida");
  }
});

// Execute os testes com:
// deno test --allow-net supabase/functions/webhook-whatsapp/message-analyzer.test.ts
