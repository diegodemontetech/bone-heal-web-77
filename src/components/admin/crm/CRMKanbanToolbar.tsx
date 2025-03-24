
import { Button } from "@/components/ui/button";
import { PipelineSelector } from "./PipelineSelector";
import { PlusCircle } from "lucide-react";

interface CRMKanbanToolbarProps {
  selectedPipeline: string | null;
  onPipelineChange: (pipelineId: string | null) => void;
  onCreateContact: () => void;
  disabled: boolean;
}

export const CRMKanbanToolbar = ({
  selectedPipeline,
  onPipelineChange,
  onCreateContact,
  disabled
}: CRMKanbanToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <PipelineSelector 
          selectedPipeline={selectedPipeline} 
          onPipelineChange={onPipelineChange} 
        />
      </div>
      <Button onClick={onCreateContact} disabled={disabled}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Novo Contato
      </Button>
    </div>
  );
};
