
// Simuladores para ações e condições durante execução de fluxos de trabalho

export const simulateAction = (service: string, action: string, data: any) => {
  console.log(`Simulando ação: ${service}.${action} com dados:`, data);
  
  // Simular diferentes tipos de ações
  switch (service) {
    case "email":
      if (action === "sendEmail") {
        return {
          success: true,
          messageId: `sim-${Date.now()}`,
          to: data.email || "destinatario@exemplo.com",
          message: "Email enviado com sucesso (simulação)"
        };
      }
      break;
      
    case "whatsapp":
      if (action === "sendMessage") {
        return {
          success: true,
          messageId: `whats-${Date.now()}`,
          to: data.phone || "5511999999999",
          message: "Mensagem WhatsApp enviada com sucesso (simulação)"
        };
      }
      break;
      
    case "crm":
      if (action === "updateLead") {
        return {
          success: true,
          leadId: data.id || "lead-id",
          updatedFields: data.fields || {},
          message: "Lead atualizado com sucesso (simulação)"
        };
      }
      break;
      
    case "notification":
      if (action === "sendNotification") {
        return {
          success: true,
          notificationId: `notif-${Date.now()}`,
          message: "Notificação enviada com sucesso (simulação)"
        };
      }
      break;
  }
  
  // Retorno padrão para ações não específicas
  return {
    success: true,
    action: `${service}.${action}`,
    timestamp: new Date().toISOString(),
    simulatedResponse: "Esta é uma resposta simulada para fins de teste"
  };
};

export const simulateCondition = (action: string, data: any) => {
  console.log(`Simulando condição: ${action} com dados:`, data);
  
  switch (action) {
    case "filter":
      // Simular verificação de condição baseada em um campo específico
      const fieldValue = data.fieldToCheck ? data.value : null;
      const condition = data.condition || "equals";
      const targetValue = data.targetValue;
      
      let result = false;
      if (fieldValue) {
        switch (condition) {
          case "equals":
            result = fieldValue === targetValue;
            break;
          case "contains":
            result = String(fieldValue).includes(String(targetValue));
            break;
          case "greaterThan":
            result = Number(fieldValue) > Number(targetValue);
            break;
          case "lessThan":
            result = Number(fieldValue) < Number(targetValue);
            break;
          default:
            result = true;
        }
      }
      
      return {
        success: true,
        result,
        condition,
        fieldValue,
        targetValue,
        message: `Condição avaliada como ${result ? 'verdadeira' : 'falsa'} (simulação)`
      };
      
    case "errorCheck":
      // Verifica se há um erro nas etapas anteriores
      const hasError = data.error !== undefined;
      return {
        success: true,
        result: hasError,
        message: hasError ? "Erro detectado" : "Nenhum erro detectado"
      };
      
    default:
      // Condição genérica - alterna entre verdadeiro e falso para testes
      const randomResult = Math.random() > 0.5;
      return {
        success: true,
        result: randomResult,
        message: `Condição avaliada como ${randomResult ? 'verdadeira' : 'falsa'} (aleatório para testes)`
      };
  }
};
