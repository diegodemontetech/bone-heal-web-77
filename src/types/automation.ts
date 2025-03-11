
export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    service: string;
    action: string;
    icon?: string;
    [key: string]: any;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  animated?: boolean;
}

export interface WorkflowExecution {
  id: string;
  flow_id: string;
  status: "queued" | "running" | "completed" | "failed";
  trigger_data: any;
  result: any;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface ExecutionLog {
  id: string;
  execution_id: string;
  node_id: string;
  status: "processing" | "completed" | "error";
  data: any;
  timestamp: string;
}
