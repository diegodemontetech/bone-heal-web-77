
export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { 
    label: string;
    service: string;
    action: string;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export interface ExecuteRequest {
  flowId: string;
  triggerData?: any;
}

export interface NodeResult {
  [key: string]: any;
}

export interface ExecutionResults {
  [nodeId: string]: any;
}
