
import {
  Mail,
  MessageCircle,
  Database,
  CreditCard,
  UserPlus,
  AlertTriangle,
  FileText,
  Calendar,
  Filter,
  Bell,
  Clock,
  Timer,
  Tag,
  User,
  Infinity,
  Check,
  Edit,
  UploadCloud,
  Download,
  Trash2,
  Share2,
  GitMerge,
  GitBranch,
  ArrowRight,
  BarChart2,
  Percent,
  DollarSign,
  Briefcase,
  Target,
  Phone
} from "lucide-react";
import React from "react";

// Interface para o item de ação
export interface ActionItemData {
  label: string;
  description: string;
  icon: JSX.Element;
  nodeType: string;
  type: string;
  service: string;
  action: string;
}

// Gatilhos
export const triggerItems: ActionItemData[] = [
  { 
    label: "Lead Criado", 
    description: "Ativa quando um novo lead é registrado", 
    icon: React.createElement(UserPlus, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "crm",
    action: "newLead"
  },
  { 
    label: "Pedido Realizado", 
    description: "Ativa quando um novo pedido é feito", 
    icon: React.createElement(CreditCard, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "orders",
    action: "newOrder"
  },
  { 
    label: "Mensagem WhatsApp", 
    description: "Ativa ao receber uma mensagem no WhatsApp", 
    icon: React.createElement(MessageCircle, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "whatsapp",
    action: "newMessage"
  },
  { 
    label: "Agendamento", 
    description: "Executa em uma programação definida", 
    icon: React.createElement(Calendar, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "scheduler",
    action: "cronJob"
  },
  { 
    label: "Formulário Enviado", 
    description: "Ativa quando um formulário é enviado", 
    icon: React.createElement(Edit, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "forms",
    action: "formSubmitted"
  },
  { 
    label: "Produto Criado", 
    description: "Ativa quando um produto é criado", 
    icon: React.createElement(Briefcase, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "products",
    action: "productCreated"
  },
  { 
    label: "Estágio de Lead Alterado", 
    description: "Ativa quando um lead muda de estágio", 
    icon: React.createElement(GitBranch, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "crm",
    action: "leadStageChanged"
  },
  { 
    label: "Email Recebido", 
    description: "Ativa quando um email é recebido", 
    icon: React.createElement(Mail, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "email",
    action: "emailReceived"
  },
  { 
    label: "Ticket de Suporte", 
    description: "Ativa quando um ticket é criado ou atualizado", 
    icon: React.createElement(AlertTriangle, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "support",
    action: "ticketCreated"
  },
  { 
    label: "Pagamento Confirmado", 
    description: "Ativa quando um pagamento é confirmado", 
    icon: React.createElement(DollarSign, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "payments",
    action: "paymentConfirmed"
  },
  { 
    label: "Gatilho Manual", 
    description: "Ativa manualmente pela interface", 
    icon: React.createElement(Target, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "manual",
    action: "manualTrigger"
  },
  { 
    label: "Webhook", 
    description: "Ativa por chamada de API externa", 
    icon: React.createElement(Share2, { className: "h-4 w-4" }), 
    nodeType: "triggerNode", 
    type: "trigger",
    service: "webhook",
    action: "webhookReceived"
  }
];

// Ações
export const actionItems: ActionItemData[] = [
  { 
    label: "Enviar Email", 
    description: "Envia uma mensagem por email", 
    icon: React.createElement(Mail, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "email",
    action: "sendEmail"
  },
  { 
    label: "Enviar WhatsApp", 
    description: "Envia uma mensagem pelo WhatsApp", 
    icon: React.createElement(MessageCircle, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "whatsapp",
    action: "sendMessage"
  },
  { 
    label: "Atualizar Database", 
    description: "Atualiza registros no banco de dados", 
    icon: React.createElement(Database, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "database",
    action: "updateRecord"
  },
  { 
    label: "Criar Registro", 
    description: "Cria um novo registro no banco", 
    icon: React.createElement(UploadCloud, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "database",
    action: "createRecord"
  },
  { 
    label: "Excluir Registro", 
    description: "Remove um registro do banco", 
    icon: React.createElement(Trash2, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "database",
    action: "deleteRecord"
  },
  { 
    label: "Notificação", 
    description: "Envia notificação para administradores", 
    icon: React.createElement(Bell, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "notification",
    action: "sendNotification"
  },
  { 
    label: "Gerar PDF", 
    description: "Cria um documento PDF", 
    icon: React.createElement(FileText, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "document",
    action: "generatePdf"
  },
  { 
    label: "Mover Lead", 
    description: "Move lead para outro estágio", 
    icon: React.createElement(GitMerge, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "crm",
    action: "moveLead"
  },
  { 
    label: "Atribuir Lead", 
    description: "Atribui lead para um usuário", 
    icon: React.createElement(User, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "crm",
    action: "assignLead"
  },
  { 
    label: "Iniciar SLA", 
    description: "Inicia um temporizador de SLA", 
    icon: React.createElement(Timer, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "timer",
    action: "startTimer"
  },
  { 
    label: "Adicionar Tag", 
    description: "Adiciona etiqueta a um registro", 
    icon: React.createElement(Tag, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "tag",
    action: "addTag"
  },
  { 
    label: "Remover Tag", 
    description: "Remove etiqueta de um registro", 
    icon: React.createElement(Tag, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "tag",
    action: "removeTag"
  },
  { 
    label: "Fazer Chamada", 
    description: "Inicia uma chamada telefônica", 
    icon: React.createElement(Phone, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "phone",
    action: "makeCall"
  },
  { 
    label: "Webhook Externo", 
    description: "Chama webhook de serviço externo", 
    icon: React.createElement(Share2, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "webhook",
    action: "callWebhook"
  },
  { 
    label: "Criar Usuário", 
    description: "Cria um novo usuário", 
    icon: React.createElement(UserPlus, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "user",
    action: "createUser"
  },
  { 
    label: "Atualizar Função", 
    description: "Atualiza função de usuário", 
    icon: React.createElement(User, { className: "h-4 w-4" }), 
    nodeType: "actionNode", 
    type: "action",
    service: "user",
    action: "updateUserRole"
  }
];

// Condições
export const conditionItems: ActionItemData[] = [
  { 
    label: "Filtro", 
    description: "Condicional baseado em dados", 
    icon: React.createElement(Filter, { className: "h-4 w-4" }), 
    nodeType: "conditionNode", 
    type: "condition",
    service: "logic",
    action: "filter"
  },
  { 
    label: "Verificar Erro", 
    description: "Verifica se houve erro nas etapas anteriores", 
    icon: React.createElement(AlertTriangle, { className: "h-4 w-4" }), 
    nodeType: "conditionNode", 
    type: "condition",
    service: "logic",
    action: "errorCheck"
  },
  { 
    label: "Comparar Valores", 
    description: "Compara dois valores", 
    icon: React.createElement(Check, { className: "h-4 w-4" }), 
    nodeType: "conditionNode", 
    type: "condition",
    service: "logic",
    action: "valueCompare"
  },
  { 
    label: "Verificar SLA", 
    description: "Verifica status de SLA", 
    icon: React.createElement(Clock, { className: "h-4 w-4" }), 
    nodeType: "conditionNode", 
    type: "condition",
    service: "logic",
    action: "slaCheck"
  },
  { 
    label: "Contém Tag", 
    description: "Verifica se contém uma etiqueta", 
    icon: React.createElement(Tag, { className: "h-4 w-4" }), 
    nodeType: "conditionNode", 
    type: "condition",
    service: "logic",
    action: "tagCheck"
  },
  { 
    label: "Verificar Status", 
    description: "Verifica status de um registro", 
    icon: React.createElement(BarChart2, { className: "h-4 w-4" }), 
    nodeType: "conditionNode", 
    type: "condition",
    service: "logic",
    action: "statusCheck"
  },
  { 
    label: "Verificar Permissão", 
    description: "Verifica permissão de usuário", 
    icon: React.createElement(User, { className: "h-4 w-4" }), 
    nodeType: "conditionNode", 
    type: "condition",
    service: "logic",
    action: "permissionCheck"
  }
];

// Temporizadores
export const timerItems: ActionItemData[] = [
  { 
    label: "Esperar", 
    description: "Aguarda por tempo determinado", 
    icon: React.createElement(Clock, { className: "h-4 w-4" }), 
    nodeType: "timerNode", 
    type: "timer",
    service: "timer",
    action: "delay"
  },
  { 
    label: "Agendamento", 
    description: "Executa em data/hora específica", 
    icon: React.createElement(Calendar, { className: "h-4 w-4" }), 
    nodeType: "timerNode", 
    type: "timer",
    service: "timer",
    action: "schedule"
  },
  { 
    label: "Expressão Cron", 
    description: "Executa em padrão recorrente", 
    icon: React.createElement(Infinity, { className: "h-4 w-4" }), 
    nodeType: "timerNode", 
    type: "timer",
    service: "timer",
    action: "cron"
  },
  { 
    label: "SLA", 
    description: "Monitora tempo de resposta", 
    icon: React.createElement(Timer, { className: "h-4 w-4" }), 
    nodeType: "timerNode", 
    type: "timer",
    service: "timer",
    action: "sla"
  }
];
