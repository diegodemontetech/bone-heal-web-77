
import { WhatsAppMessage } from "@/components/admin/whatsapp/types";
import { Node, Edge } from 'reactflow';

export type NodeType = 'trigger' | 'action' | 'condition' | 'timer';

export interface ActionNode extends Node<any, string> {
  type: 'action';
  actionType: string;
  data: {
    [key: string]: any;
  };
}

export interface ConditionNode extends Node<any, string> {
  type: 'condition';
  conditionType: string;
  data: {
    [key: string]: any;
  };
}

export interface TimerNode extends Node<any, string> {
  type: 'timer';
  timerType: string;
  data: {
    [key: string]: any;
  };
}

export interface TriggerNode extends Node<any, string> {
  type: 'trigger';
  triggerType: string;
  data: {
    [key: string]: any;
  };
}

export type FlowNode = ActionNode | ConditionNode | TimerNode | TriggerNode;

export interface FlowEdge extends Edge<any> {
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
