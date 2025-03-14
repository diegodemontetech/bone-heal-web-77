
export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { 
    label: string;
    service: string;
    action: string;
    config?: Record<string, any>; // Configurações adicionais do nó
    inputs?: Record<string, any>; // Entradas configuradas
    outputs?: string[]; // Saídas disponíveis
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  nodes: Node[];
  edges: Edge[];
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
  tags?: string[];
  version?: number;
  execution_count?: number;
  last_execution?: string;
}

export interface ExecuteRequest {
  flowId: string;
  triggerData?: any;
}

export interface NodeResult {
  [key: string]: any;
  error?: string;
  timestamp?: string;
}

export interface ExecutionResults {
  [nodeId: string]: any;
  execution_id?: string;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  status?: string;
  trigger_data?: any;
  error?: string;
}

export interface SLAConfig {
  hours: number;
  critical_threshold?: number; // Porcentagem (ex: 80 significa alerta quando atingir 80% do tempo)
  actions?: {
    warning?: string[];
    breach?: string[];
  };
}

export interface TimerConfig {
  type: 'delay' | 'schedule' | 'cron';
  value: string | number; // Segundos para delay, ISO Date para schedule, expressão cron para cron
  timezone?: string;
}

export interface ConditionConfig {
  type: 'comparison' | 'expression' | 'sla' | 'error';
  field?: string;
  operator?: string;
  value?: any;
  expression?: string;
  sla?: SLAConfig;
}

export interface ExecutionLog {
  id: string;
  execution_id: string;
  node_id: string;
  status: 'processing' | 'completed' | 'error';
  data: any;
  result?: any;
  error?: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}
