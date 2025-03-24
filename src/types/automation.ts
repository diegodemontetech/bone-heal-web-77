
import { WhatsAppMessage } from "@/components/admin/whatsapp/types";

export type NodeType = 'trigger' | 'action' | 'condition' | 'timer';

export interface ActionNode {
  id: string;
  type: 'action';
  actionType: string;
  data: {
    [key: string]: any;
  };
}

export interface ConditionNode {
  id: string;
  type: 'condition';
  conditionType: string;
  data: {
    [key: string]: any;
  };
}

export interface TimerNode {
  id: string;
  type: 'timer';
  timerType: string;
  data: {
    [key: string]: any;
  };
}

export interface TriggerNode {
  id: string;
  type: 'trigger';
  triggerType: string;
  data: {
    [key: string]: any;
  };
}

export type FlowNode = ActionNode | ConditionNode | TimerNode | TriggerNode;

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessageInAutomation extends WhatsAppMessage {}

export interface WhatsAppInstance {
  id: string;
  name: string;
  instance_name: string;
  status: string;
  qr_code: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AutomationFlow {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}
