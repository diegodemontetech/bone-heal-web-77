
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStagesConfig } from "./stages/useStagesConfig";
import { CRMStage } from "@/types/crm";
import { NewStageForm } from "./stages/NewStageForm";
import { StagesList } from "./stages/StagesList";

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
          <div className="space-y-4">
            {stages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum estágio configurado. Clique em "Novo Estágio" para começar.
              </div>
            ) : (
              <StagesList 
                stages={stages} 
                onEdit={handleOpenDialog} 
                onDelete={handleDeleteStage} 
              />
            )}
            
            <NewStageForm 
              onAdd={handleCreateStage}
              isLoading={isSaving}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
