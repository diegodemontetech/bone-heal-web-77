
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnInit,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

// Importando os nós customizados
import TriggerNode from "./nodes/TriggerNode";
import ActionNode from "./nodes/ActionNode";
import ConditionNode from "./nodes/ConditionNode";
import TimerNode from "./nodes/TimerNode";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Save, Play } from "lucide-react";

// Registrando os tipos de nós
const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
  timerNode: TimerNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onInit: OnInit;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onSave?: () => void;
  onExecute?: () => void;
  isSaving?: boolean;
  canExecute?: boolean;
}

const FlowCanvas = ({
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
  canExecute = false,
}: FlowCanvasProps) => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const handleFitView = () => {
    fitView({ padding: 0.2 });
  };

  const handleZoomIn = () => {
    zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 300 });
  };

  return (
    <div className="relative h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          animated: true,
          type: 'smoothstep',
        }}
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#999', strokeWidth: 2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#f0f0f0"
          gap={16}
          size={1}
          variant="dots"
        />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'triggerNode') return '#10b981';
            if (n.type === 'actionNode') return '#3b82f6';
            if (n.type === 'conditionNode') return '#f59e0b';
            if (n.type === 'timerNode') return '#9333ea';
            return '#666';
          }}
          nodeColor={(n) => {
            if (n.type === 'triggerNode') return '#d1fae5';
            if (n.type === 'actionNode') return '#dbeafe';
            if (n.type === 'conditionNode') return '#fef3c7';
            if (n.type === 'timerNode') return '#f3e8ff';
            return '#fff';
          }}
          maskColor="rgba(240, 240, 240, 0.5)"
        />
        
        <Panel position="top-right" className="flex gap-2">
          {onSave && (
            <Button 
              size="sm" 
              variant="outline"
              className="bg-white"
              onClick={onSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          )}
          {onExecute && (
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white"
              onClick={onExecute}
              disabled={!canExecute}
            >
              <Play className="h-4 w-4 mr-1" />
              Executar
            </Button>
          )}
        </Panel>
        
        <Panel position="bottom-left" className="flex gap-2">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 bg-white"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 bg-white"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 bg-white"
            onClick={handleFitView}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
