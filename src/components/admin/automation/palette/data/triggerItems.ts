
import React from "react";
import {
  UserPlus,
  CreditCard,
  MessageCircle,
  Calendar,
  Edit,
  Briefcase,
  GitBranch,
  Mail,
  AlertTriangle,
  DollarSign,
  Target,
  Share2
} from "lucide-react";
import { ActionItemData } from "../types/actionItem";
import { NODE_TYPES, ITEM_TYPES, SERVICES } from "../constants/nodeTypes";

export const triggerItems: ActionItemData[] = [
  { 
    label: "Lead Criado", 
    description: "Ativa quando um novo lead é registrado", 
    icon: React.createElement(UserPlus, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.CRM,
    action: "newLead"
  },
  { 
    label: "Pedido Realizado", 
    description: "Ativa quando um novo pedido é feito", 
    icon: React.createElement(CreditCard, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.ORDERS,
    action: "newOrder"
  },
  { 
    label: "Mensagem WhatsApp", 
    description: "Ativa ao receber uma mensagem no WhatsApp", 
    icon: React.createElement(MessageCircle, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.WHATSAPP,
    action: "newMessage"
  },
  { 
    label: "Agendamento", 
    description: "Executa em uma programação definida", 
    icon: React.createElement(Calendar, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.SCHEDULER,
    action: "cronJob"
  },
  { 
    label: "Formulário Enviado", 
    description: "Ativa quando um formulário é enviado", 
    icon: React.createElement(Edit, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.FORMS,
    action: "formSubmitted"
  },
  { 
    label: "Produto Criado", 
    description: "Ativa quando um produto é criado", 
    icon: React.createElement(Briefcase, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.PRODUCTS,
    action: "productCreated"
  },
  { 
    label: "Estágio de Lead Alterado", 
    description: "Ativa quando um lead muda de estágio", 
    icon: React.createElement(GitBranch, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.CRM,
    action: "leadStageChanged"
  },
  { 
    label: "Email Recebido", 
    description: "Ativa quando um email é recebido", 
    icon: React.createElement(Mail, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.EMAIL,
    action: "emailReceived"
  },
  { 
    label: "Ticket de Suporte", 
    description: "Ativa quando um ticket é criado ou atualizado", 
    icon: React.createElement(AlertTriangle, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.SUPPORT,
    action: "ticketCreated"
  },
  { 
    label: "Pagamento Confirmado", 
    description: "Ativa quando um pagamento é confirmado", 
    icon: React.createElement(DollarSign, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.PAYMENTS,
    action: "paymentConfirmed"
  },
  { 
    label: "Gatilho Manual", 
    description: "Ativa manualmente pela interface", 
    icon: React.createElement(Target, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.MANUAL,
    action: "manualTrigger"
  },
  { 
    label: "Webhook", 
    description: "Ativa por chamada de API externa", 
    icon: React.createElement(Share2, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TRIGGER, 
    type: ITEM_TYPES.TRIGGER,
    service: SERVICES.WEBHOOK,
    action: "webhookReceived"
  }
];
