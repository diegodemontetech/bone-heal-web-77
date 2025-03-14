
import React from "react";
import {
  Filter,
  AlertTriangle,
  Check,
  Clock,
  Tag,
  BarChart2,
  User
} from "lucide-react";
import { ActionItemData } from "../types/actionItem";
import { NODE_TYPES, ITEM_TYPES, SERVICES } from "../constants/nodeTypes";

export const conditionItems: ActionItemData[] = [
  { 
    label: "Filtro", 
    description: "Condicional baseado em dados", 
    icon: React.createElement(Filter, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.CONDITION, 
    type: ITEM_TYPES.CONDITION,
    service: SERVICES.LOGIC,
    action: "filter"
  },
  { 
    label: "Verificar Erro", 
    description: "Verifica se houve erro nas etapas anteriores", 
    icon: React.createElement(AlertTriangle, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.CONDITION, 
    type: ITEM_TYPES.CONDITION,
    service: SERVICES.LOGIC,
    action: "errorCheck"
  },
  { 
    label: "Comparar Valores", 
    description: "Compara dois valores", 
    icon: React.createElement(Check, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.CONDITION, 
    type: ITEM_TYPES.CONDITION,
    service: SERVICES.LOGIC,
    action: "valueCompare"
  },
  { 
    label: "Verificar SLA", 
    description: "Verifica status de SLA", 
    icon: React.createElement(Clock, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.CONDITION, 
    type: ITEM_TYPES.CONDITION,
    service: SERVICES.LOGIC,
    action: "slaCheck"
  },
  { 
    label: "Contém Tag", 
    description: "Verifica se contém uma etiqueta", 
    icon: React.createElement(Tag, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.CONDITION, 
    type: ITEM_TYPES.CONDITION,
    service: SERVICES.LOGIC,
    action: "tagCheck"
  },
  { 
    label: "Verificar Status", 
    description: "Verifica status de um registro", 
    icon: React.createElement(BarChart2, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.CONDITION, 
    type: ITEM_TYPES.CONDITION,
    service: SERVICES.LOGIC,
    action: "statusCheck"
  },
  { 
    label: "Verificar Permissão", 
    description: "Verifica permissão de usuário", 
    icon: React.createElement(User, { className: "h-4 w-4" }), 
    nodeType: NODE_TYPES.CONDITION, 
    type: ITEM_TYPES.CONDITION,
    service: SERVICES.LOGIC,
    action: "permissionCheck"
  }
];
