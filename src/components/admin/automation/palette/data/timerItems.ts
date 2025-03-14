
import React from "react";
import {
  Clock,
  Calendar,
  Infinity,
  Timer
} from "lucide-react";
import { ActionItemData } from "../types/actionItem";
import { NODE_TYPES, ITEM_TYPES, SERVICES } from "../constants/nodeTypes";

export const timerItems: ActionItemData[] = [
  { 
    label: "Esperar", 
    description: "Aguarda por tempo determinado", 
    icon: React.createElement(Clock, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TIMER, 
    type: ITEM_TYPES.TIMER,
    service: SERVICES.TIMER,
    action: "delay"
  },
  { 
    label: "Agendamento", 
    description: "Executa em data/hora específica", 
    icon: React.createElement(Calendar, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TIMER, 
    type: ITEM_TYPES.TIMER,
    service: SERVICES.TIMER,
    action: "schedule"
  },
  { 
    label: "Expressão Cron", 
    description: "Executa em padrão recorrente", 
    icon: React.createElement(Infinity, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TIMER, 
    type: ITEM_TYPES.TIMER,
    service: SERVICES.TIMER,
    action: "cron"
  },
  { 
    label: "SLA", 
    description: "Monitora tempo de resposta", 
    icon: React.createElement(Timer, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.TIMER, 
    type: ITEM_TYPES.TIMER,
    service: SERVICES.TIMER,
    action: "sla"
  }
];
