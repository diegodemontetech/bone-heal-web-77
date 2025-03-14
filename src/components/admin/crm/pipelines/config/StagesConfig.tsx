
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStagesConfig } from "./stages/useStagesConfig";
import { CRMStage } from "@/types/crm";
import { useState } from "react";
import { NewStageForm } from "./stages/NewStageForm";

export const StagesConfig = ({ pipelineId }: { pipelineId: string }) => {
  const {
    stages,
    loading,
    isDialogOpen,
    currentStage,
    isSaving,
    handleOpenDialog,
    handleCloseDialog,
    handleCreateStage,
    handleUpdateStage,
    handleDeleteStage
  } = useStagesConfig(pipelineId);

  // Implementação de funções auxiliares para o StagesList
  const handleUpdateStageField = (stage: CRMStage, field: string, value: string) => {
    const updatedStageData = {
      ...stage,
      [field]: value,
      pipeline_id: pipelineId
    };
    
    // Removendo id, created_at e updated_at para type safety
    const { id, created_at, updated_at, ...stageData } = updatedStageData;
    
    handleUpdateStage(stage.id, {
      name: stageData.name,
      color: stageData.color,
      department_id: stageData.department_id || '' // Fornecer valor padrão
    });
  };
  
  const [dragResult, setDragResult] = useState<any>(null);
  
  const handleDragEnd = (result: any) => {
    setDragResult(result);
    // Implementação do drag and drop seria aqui
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Estágios do Pipeline</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Estágio
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          // Este é um placeholder para o componente StagesList
          <div className="space-y-4">
            {stages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum estágio configurado. Clique em "Novo Estágio" para começar.
              </div>
            ) : (
              // Aqui iria o componente StagesList
              <pre className="text-xs">
                {JSON.stringify(stages, null, 2)}
              </pre>
            )}
            
            <NewStageForm 
              onAdd={(data) => handleCreateStage({
                name: data.name,
                color: data.color,
                department_id: data.department_id || 'default' // Garantir que department_id está sempre presente
              })}
              isLoading={isSaving}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
