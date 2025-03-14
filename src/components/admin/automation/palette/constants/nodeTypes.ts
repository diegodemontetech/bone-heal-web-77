
// Constantes para tipos de nós
export const NODE_TYPES = {
  TRIGGER: "triggerNode",
  ACTION: "actionNode",
  CONDITION: "conditionNode",
  TIMER: "timerNode"
} as const;

// Constantes para tipos de itens
export const ITEM_TYPES = {
  TRIGGER: "trigger",
  ACTION: "action",
  CONDITION: "condition",
  TIMER: "timer"
} as const;

// Constantes para serviços
export const SERVICES = {
  CRM: "crm",
  ORDERS: "orders",
  WHATSAPP: "whatsapp",
  SCHEDULER: "scheduler",
  FORMS: "forms",
  PRODUCTS: "products",
  EMAIL: "email",
  SUPPORT: "support",
  PAYMENTS: "payments",
  MANUAL: "manual",
  WEBHOOK: "webhook",
  DATABASE: "database",
  NOTIFICATION: "notification",
  DOCUMENT: "document",
  TIMER: "timer",
  TAG: "tag",
  PHONE: "phone",
  USER: "user",
  LOGIC: "logic"
} as const;
