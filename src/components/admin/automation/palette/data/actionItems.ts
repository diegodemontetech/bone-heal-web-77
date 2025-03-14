
import React from "react";
import {
  Mail,
  MessageCircle,
  Database,
  Bell,
  FileText,
  GitMerge,
  User,
  Timer,
  Tag,
  Phone,
  Share2,
  UserPlus,
  UploadCloud,
  Trash2
} from "lucide-react";
import { ActionItemData } from "../types/actionItem";
import { NODE_TYPES, ITEM_TYPES, SERVICES } from "../constants/nodeTypes";

export const actionItems: ActionItemData[] = [
  { 
    label: "Enviar Email", 
    description: "Envia uma mensagem por email", 
    icon: React.createElement(Mail, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.EMAIL,
    action: "sendEmail"
  },
  { 
    label: "Enviar WhatsApp", 
    description: "Envia uma mensagem pelo WhatsApp", 
    icon: React.createElement(MessageCircle, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.WHATSAPP,
    action: "sendMessage"
  },
  { 
    label: "Atualizar Database", 
    description: "Atualiza registros no banco de dados", 
    icon: React.createElement(Database, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.DATABASE,
    action: "updateRecord"
  },
  { 
    label: "Criar Registro", 
    description: "Cria um novo registro no banco", 
    icon: React.createElement(UploadCloud, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.DATABASE,
    action: "createRecord"
  },
  { 
    label: "Excluir Registro", 
    description: "Remove um registro do banco", 
    icon: React.createElement(Trash2, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.DATABASE,
    action: "deleteRecord"
  },
  { 
    label: "Notificação", 
    description: "Envia notificação para administradores", 
    icon: React.createElement(Bell, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.NOTIFICATION,
    action: "sendNotification"
  },
  { 
    label: "Gerar PDF", 
    description: "Cria um documento PDF", 
    icon: React.createElement(FileText, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.DOCUMENT,
    action: "generatePdf"
  },
  { 
    label: "Mover Lead", 
    description: "Move lead para outro estágio", 
    icon: React.createElement(GitMerge, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.CRM,
    action: "moveLead"
  },
  { 
    label: "Atribuir Lead", 
    description: "Atribui lead para um usuário", 
    icon: React.createElement(User, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.CRM,
    action: "assignLead"
  },
  { 
    label: "Iniciar SLA", 
    description: "Inicia um temporizador de SLA", 
    icon: React.createElement(Timer, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.TIMER,
    action: "startTimer"
  },
  { 
    label: "Adicionar Tag", 
    description: "Adiciona etiqueta a um registro", 
    icon: React.createElement(Tag, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.TAG,
    action: "addTag"
  },
  { 
    label: "Remover Tag", 
    description: "Remove etiqueta de um registro", 
    icon: React.createElement(Tag, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.TAG,
    action: "removeTag"
  },
  { 
    label: "Fazer Chamada", 
    description: "Inicia uma chamada telefônica", 
    icon: React.createElement(Phone, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.PHONE,
    action: "makeCall"
  },
  { 
    label: "Webhook Externo", 
    description: "Chama webhook de serviço externo", 
    icon: React.createElement(Share2, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.WEBHOOK,
    action: "callWebhook"
  },
  { 
    label: "Criar Usuário", 
    description: "Cria um novo usuário", 
    icon: React.createElement(UserPlus, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.USER,
    action: "createUser"
  },
  { 
    label: "Atualizar Função", 
    description: "Atualiza função de usuário", 
    icon: React.createElement(User, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.ACTION, 
    type: ITEM_TYPES.ACTION,
    service: SERVICES.USER,
    action: "updateUserRole"
  }
];
