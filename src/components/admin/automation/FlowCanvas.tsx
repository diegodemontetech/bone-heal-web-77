
import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  NodeTypes,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import TimerNode from './nodes/TimerNode';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Save, Play } from 'lucide-react';
import { toast } from 'sonner';

// Definir tipos de nós
const nodeTypes: NodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
  timerNode: TimerNode,
};

export interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onInit: (instance: ReactFlowInstance) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onSave: () => Promise<void>;
  onExecute: () => void;
  isSaving: boolean;
  canExecute: boolean;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  onDrop,
  onDragOver,
  onSave,
  onExecute,
  isSaving,
  canExecute,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSave = async () => {
    try {
      await onSave();
      toast.success('Fluxo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      toast.error('Erro ao salvar fluxo');
    }
  };

  const handleExecute = async () => {
    if (!canExecute) return;
    
    try {
      setIsExecuting(true);
      await onExecute();
    } catch (error) {
      console.error('Erro ao executar fluxo:', error);
      toast.error('Erro ao executar fluxo');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="h-[600px] w-full">
      <div className="flex justify-between items-center p-2 border-b">
        <div>
          <p className="text-sm text-muted-foreground">
            {nodes.length === 0 ? (
              <span className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                Arraste elementos para o canvas para construir seu fluxo
              </span>
            ) : (
              <span>{nodes.length} nós e {edges.length} conexões</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-1" />
            Salvar
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExecute} 
            disabled={isExecuting || !canExecute}
          >
            <Play className="h-4 w-4 mr-1" />
            Executar
          </Button>
        </div>
      </div>
      <div className="h-[550px] w-full" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </Card>
  );
};

export default FlowCanvas;
