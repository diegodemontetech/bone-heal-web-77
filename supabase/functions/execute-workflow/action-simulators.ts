
// Simuladores de ações para diferentes tipos de nós
export function simulateAction(service: string, action: string, inputData: any): any {
  // Simulação de ações
  switch (service) {
    case 'email':
      return simulateEmailAction(action, inputData);
    
    case 'whatsapp':
      return simulateWhatsAppAction(action, inputData);
    
    case 'database':
      return simulateDatabaseAction(action, inputData);
    
    case 'notification':
      return simulateNotificationAction(action, inputData);
      
    case 'document':
      return simulateDocumentAction(action, inputData);

    case 'crm':
      return simulateCrmAction(action, inputData);
    
    case 'timer':
      return simulateTimerAction(action, inputData);
      
    case 'user':
      return simulateUserAction(action, inputData);
      
    case 'tag':
      return simulateTagAction(action, inputData);
      
    default:
      return {
        success: true,
        action: `Executou ${action} em ${service}`,
        data: inputData
      };
  }
}

// Ações de Email
function simulateEmailAction(action: string, inputData: any): any {
  switch (action) {
    case 'sendEmail':
      return {
        success: true,
        action: "Email enviado",
        to: inputData.email || "destinatario@exemplo.com",
        subject: inputData.subject || "Assunto do email",
        template: inputData.template_id || null,
        data: inputData
      };
    case 'verifyEmailOpen':
      return {
        success: true,
        action: "Verificação de abertura de email",
        email_id: inputData.email_id || "email123",
        was_opened: Math.random() > 0.3, // Simulação
        data: inputData
      };
    default:
      return { success: true, action: `Email: ${action}`, data: inputData };
  }
}

// Ações de WhatsApp
function simulateWhatsAppAction(action: string, inputData: any): any {
  switch (action) {
    case 'sendMessage':
      return {
        success: true,
        action: "Mensagem WhatsApp enviada",
        to: inputData.phone || "+5511999999999",
        message: inputData.message || "Conteúdo da mensagem",
        instance_id: inputData.instance_id || "default",
        data: inputData
      };
    case 'sendTemplate':
      return {
        success: true,
        action: "Template WhatsApp enviado",
        to: inputData.phone || "+5511999999999",
        template_name: inputData.template || "welcome",
        data: inputData
      };
    default:
      return { success: true, action: `WhatsApp: ${action}`, data: inputData };
  }
}

// Ações de Banco de Dados
function simulateDatabaseAction(action: string, inputData: any): any {
  switch (action) {
    case 'updateRecord':
      return {
        success: true,
        action: "Registro atualizado",
        table: inputData.table || "users",
        id: inputData.id || "123",
        fields: inputData.fields || { updated: true },
        data: inputData
      };
    case 'createRecord':
      return {
        success: true,
        action: "Registro criado",
        table: inputData.table || "users",
        id: `new-${Date.now()}`,
        fields: inputData.fields || { created: true },
        data: inputData
      };
    case 'deleteRecord':
      return {
        success: true,
        action: "Registro excluído",
        table: inputData.table || "users",
        id: inputData.id || "123",
        data: inputData
      };
    default:
      return { success: true, action: `Database: ${action}`, data: inputData };
  }
}

// Ações de Notificação
function simulateNotificationAction(action: string, inputData: any): any {
  switch (action) {
    case 'sendNotification':
      return {
        success: true,
        action: "Notificação enviada",
        to: inputData.user_id || "admin",
        message: inputData.message || "Nova notificação",
        level: inputData.level || "info",
        data: inputData
      };
    case 'broadcastNotification':
      return {
        success: true,
        action: "Notificação em massa",
        to_role: inputData.role || "admin",
        message: inputData.message || "Notificação para todos",
        data: inputData
      };
    default:
      return { success: true, action: `Notification: ${action}`, data: inputData };
  }
}

// Ações de Documento
function simulateDocumentAction(action: string, inputData: any): any {
  switch (action) {
    case 'generatePdf':
      return {
        success: true,
        action: "PDF gerado",
        template: inputData.template || "default",
        data: inputData,
        file_url: "https://exemplo.com/arquivo.pdf"
      };
    case 'sendDocument':
      return {
        success: true,
        action: "Documento enviado",
        to: inputData.email || "destinatario@exemplo.com",
        document_url: inputData.file_url || "https://exemplo.com/arquivo.pdf",
        data: inputData
      };
    default:
      return { success: true, action: `Document: ${action}`, data: inputData };
  }
}

// Ações de CRM
function simulateCrmAction(action: string, inputData: any): any {
  switch (action) {
    case 'moveLead':
      return {
        success: true,
        action: "Lead movido de estágio",
        lead_id: inputData.lead_id || "lead123",
        from_stage: inputData.from_stage || "novo",
        to_stage: inputData.to_stage || "qualificado",
        data: inputData
      };
    case 'assignLead':
      return {
        success: true,
        action: "Lead atribuído",
        lead_id: inputData.lead_id || "lead123",
        user_id: inputData.user_id || "user123",
        data: inputData
      };
    case 'scoreLead':
      return {
        success: true,
        action: "Lead pontuado",
        lead_id: inputData.lead_id || "lead123",
        score: inputData.score || 10,
        data: inputData
      };
    default:
      return { success: true, action: `CRM: ${action}`, data: inputData };
  }
}

// Ações de Timer/SLA
function simulateTimerAction(action: string, inputData: any): any {
  switch (action) {
    case 'startTimer':
      return {
        success: true,
        action: "Temporizador iniciado",
        entity_id: inputData.entity_id || "entity123",
        sla_hours: inputData.sla_hours || 24,
        start_time: new Date().toISOString(),
        data: inputData
      };
    case 'pauseTimer':
      return {
        success: true,
        action: "Temporizador pausado",
        timer_id: inputData.timer_id || "timer123",
        pause_time: new Date().toISOString(),
        data: inputData
      };
    case 'checkSLA':
      return {
        success: true,
        action: "SLA verificado",
        entity_id: inputData.entity_id || "entity123",
        is_breached: Math.random() > 0.7, // Simulação
        remaining_hours: Math.floor(Math.random() * 24),
        data: inputData
      };
    default:
      return { success: true, action: `Timer: ${action}`, data: inputData };
  }
}

// Ações de Usuário
function simulateUserAction(action: string, inputData: any): any {
  switch (action) {
    case 'createUser':
      return {
        success: true,
        action: "Usuário criado",
        email: inputData.email || "usuario@exemplo.com",
        role: inputData.role || "user",
        new_user_id: `user-${Date.now()}`,
        data: inputData
      };
    case 'updateUserRole':
      return {
        success: true,
        action: "Função de usuário atualizada",
        user_id: inputData.user_id || "user123",
        old_role: inputData.old_role || "user",
        new_role: inputData.new_role || "admin",
        data: inputData
      };
    default:
      return { success: true, action: `User: ${action}`, data: inputData };
  }
}

// Ações de Tag/Etiqueta
function simulateTagAction(action: string, inputData: any): any {
  switch (action) {
    case 'addTag':
      return {
        success: true,
        action: "Etiqueta adicionada",
        entity_id: inputData.entity_id || "entity123",
        entity_type: inputData.entity_type || "lead",
        tag: inputData.tag || "importante",
        data: inputData
      };
    case 'removeTag':
      return {
        success: true,
        action: "Etiqueta removida",
        entity_id: inputData.entity_id || "entity123",
        entity_type: inputData.entity_type || "lead",
        tag: inputData.tag || "importante",
        data: inputData
      };
    default:
      return { success: true, action: `Tag: ${action}`, data: inputData };
  }
}

export function simulateCondition(action: string, inputData: any): any {
  switch (action) {
    case 'filter':
      // Simulação de filtro baseado em propriedades
      if (inputData.filter_field && inputData.filter_value) {
        const fieldValue = inputData[inputData.filter_field];
        const result = fieldValue === inputData.filter_value;
        return {
          condition: "filter",
          field: inputData.filter_field,
          expected: inputData.filter_value,
          actual: fieldValue,
          result,
          data: inputData
        };
      }
      // Simulação padrão
      const result = Math.random() > 0.5;
      return {
        condition: "filter",
        result,
        data: inputData
      };
    
    case 'errorCheck':
      // Verificar se há erro nos dados de entrada
      const hasError = inputData.error !== undefined;
      return {
        condition: "errorCheck",
        result: !hasError,
        error: inputData.error,
        data: inputData
      };
    
    case 'slaCheck':
      // Verifica se um SLA foi violado
      const slaBreached = Math.random() > 0.7;
      return {
        condition: "slaCheck",
        sla_hours: inputData.sla_hours || 24,
        elapsed_hours: Math.floor(Math.random() * 36),
        result: !slaBreached,
        data: inputData
      };
      
    case 'valueCompare':
      // Compara dois valores
      if (inputData.value1 !== undefined && inputData.value2 !== undefined && inputData.operator) {
        let compareResult = false;
        switch (inputData.operator) {
          case 'equals': 
            compareResult = inputData.value1 === inputData.value2; 
            break;
          case 'notEquals': 
            compareResult = inputData.value1 !== inputData.value2; 
            break;
          case 'greaterThan': 
            compareResult = inputData.value1 > inputData.value2; 
            break;
          case 'lessThan': 
            compareResult = inputData.value1 < inputData.value2; 
            break;
          case 'contains':
            compareResult = String(inputData.value1).includes(String(inputData.value2));
            break;
        }
        return {
          condition: "valueCompare",
          operator: inputData.operator,
          value1: inputData.value1,
          value2: inputData.value2,
          result: compareResult,
          data: inputData
        };
      }
      return {
        condition: "valueCompare",
        result: Math.random() > 0.5,
        data: inputData
      };
    
    default:
      return {
        condition: action,
        result: true,
        data: inputData
      };
  }
}
