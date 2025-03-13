
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StagesList } from "./stages/StagesList";
import { NewStageForm } from "./stages/NewStageForm";
import { useStagesConfig } from "./stages/useStagesConfig";

interface StagesConfigProps {
  pipelineId: string;
}

export const StagesConfig = ({ pipelineId }: StagesConfigProps) => {
  const {
    stages,
    loading,
    saving,
    handleAddStage,
    handleDeleteStage,
    handleUpdateStage,
    onDragEnd
  } = useStagesConfig(pipelineId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estágios do Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Configure os estágios pelos quais os leads vão passar neste pipeline. Arraste para reordenar.
        </p>

        <div className="space-y-4">
          {!loading && (
            <StagesList
              stages={stages}
              onDragEnd={onDragEnd}
              onUpdateStage={handleUpdateStage}
              onDeleteStage={handleDeleteStage}
            />
          )}

          <NewStageForm 
            onAdd={handleAddStage}
            isLoading={saving}
          />
        </div>
      </CardContent>
    </Card>
  );
};
