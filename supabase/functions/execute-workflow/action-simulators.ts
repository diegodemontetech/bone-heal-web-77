
// Simuladores de ações para diferentes tipos de nós
export function simulateAction(service: string, action: string, inputData: any): any {
  // Simulação de ações
  switch (service) {
    case 'email':
      return {
        success: true,
        action: "Enviou email",
        to: inputData.email || "destinatario@exemplo.com",
        subject: "Assunto do email",
        data: inputData
      };
    
    case 'whatsapp':
      return {
        success: true,
        action: "Enviou mensagem WhatsApp",
        to: inputData.phone || "+5511999999999",
        message: "Conteúdo da mensagem",
        data: inputData
      };
    
    case 'database':
      return {
        success: true,
        action: "Atualizou registro",
        table: "users",
        id: inputData.id || "123",
        fields: { updated: true },
        data: inputData
      };
    
    default:
      return {
        success: true,
        action: `Executou ${action} em ${service}`,
        data: inputData
      };
  }
}

export function simulateCondition(action: string, inputData: any): any {
  // Simulação de condições
  if (action === "filter") {
    // Simular alguma lógica de filtro
    const result = Math.random() > 0.5;
    return {
      condition: "filter",
      result,
      data: inputData
    };
  }
  
  if (action === "errorCheck") {
    // Verificar se há erro nos dados de entrada
    const hasError = inputData.error !== undefined;
    return {
      condition: "errorCheck",
      result: !hasError,
      data: inputData
    };
  }
  
  return {
    condition: action,
    result: true,
    data: inputData
  };
}
