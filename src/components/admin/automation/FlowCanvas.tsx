
import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  NodeTypes,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  useReactFlow,
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

interface FlowCanvasProps {
  flowId: string;
  onSave?: (nodes: Node[], edges: Edge[]) => Promise<void>;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const FlowCanvas = ({ flowId, onSave, initialNodes = [], initialEdges = [] }: FlowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { project } = useReactFlow();
  const [isExecuting, setIsExecuting] = useState(false);

  // Configurar o DnD
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Lidar com soltar o elemento
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      try {
        const dataStr = event.dataTransfer.getData('application/reactflow');
        const nodeData = JSON.parse(dataStr);

        // Calcular posição onde o nó foi solto
        const position = project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Criar novo nó
        const newNode = {
          id: `${nodeData.nodeType}_${Date.now()}`,
          type: nodeData.nodeType,
          position,
          data: {
            label: nodeData.label,
            description: nodeData.description,
            icon: nodeData.icon,
            service: nodeData.service,
            action: nodeData.action,
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Erro ao processar o drop:', error);
      }
    },
    [project, setNodes]
  );

  // Adicionar conexão
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Salvar fluxo
  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      await onSave(nodes, edges);
      toast.success('Fluxo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      toast.error('Erro ao salvar fluxo');
    } finally {
      setIsSaving(false);
    }
  };

  // Executar fluxo
  const handleExecute = async () => {
    if (!flowId) return;
    
    try {
      setIsExecuting(true);
      const response = await fetch(`/api/automation/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flowId }),
      });

      if (!response.ok) {
        throw new Error('Falha ao executar fluxo');
      }
      
      toast.success('Fluxo executado com sucesso!');
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
            disabled={isExecuting || nodes.length === 0}
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
