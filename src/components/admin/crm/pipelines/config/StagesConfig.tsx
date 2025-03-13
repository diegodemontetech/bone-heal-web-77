
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMStage } from "@/types/crm";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface StagesConfigProps {
  pipelineId: string;
}

interface StageFormData {
  id?: string;
  name: string;
  color: string;
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export const StagesConfig = ({ pipelineId }: StagesConfigProps) => {
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStage, setNewStage] = useState<StageFormData>({
    name: "",
    color: DEFAULT_COLORS[0]
  });

  useEffect(() => {
    fetchStages();
  }, [pipelineId]);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_stages")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("order");

      if (error) throw error;
      setStages(data || []);
    } catch (err) {
      console.error("Erro ao buscar estágios:", err);
      toast.error("Erro ao carregar estágios");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = async () => {
    if (!newStage.name.trim()) {
      toast.error("O nome do estágio é obrigatório");
      return;
    }

    setSaving(true);
    try {
      const nextOrder = stages.length > 0 
        ? Math.max(...stages.map(s => s.order)) + 1 
        : 0;

      const { data, error } = await supabase
        .from("crm_stages")
        .insert({
          name: newStage.name,
          color: newStage.color,
          pipeline_id: pipelineId,
          order: nextOrder
        })
        .select()
        .single();

      if (error) throw error;

      setStages([...stages, data]);
      setNewStage({ name: "", color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)] });
      toast.success("Estágio adicionado com sucesso");
    } catch (err) {
      console.error("Erro ao adicionar estágio:", err);
      toast.error("Erro ao adicionar estágio");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este estágio? Isso também excluirá todos os leads associados a ele.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("crm_stages")
        .delete()
        .eq("id", stageId);

      if (error) throw error;

      setStages(stages.filter(stage => stage.id !== stageId));
      toast.success("Estágio excluído com sucesso");
    } catch (err) {
      console.error("Erro ao excluir estágio:", err);
      toast.error("Erro ao excluir estágio");
    }
  };

  const handleUpdateStage = async (stage: CRMStage, field: string, value: string) => {
    const updatedStage = { ...stage, [field]: value };
    
    try {
      const { error } = await supabase
        .from("crm_stages")
        .update({ [field]: value })
        .eq("id", stage.id);

      if (error) throw error;

      setStages(stages.map(s => s.id === stage.id ? updatedStage : s));
    } catch (err) {
      console.error("Erro ao atualizar estágio:", err);
      toast.error("Erro ao atualizar estágio");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const newStages = Array.from(stages);
    const [removed] = newStages.splice(source.index, 1);
    newStages.splice(destination.index, 0, removed);

    // Atualizar ordens
    const updatedStages = newStages.map((stage, index) => ({
      ...stage,
      order: index
    }));

    setStages(updatedStages);

    // Salvar novas ordens no banco
    try {
      for (const stage of updatedStages) {
        await supabase
          .from("crm_stages")
          .update({ order: stage.order })
          .eq("id", stage.id);
      }
    } catch (err) {
      console.error("Erro ao reordenar estágios:", err);
      toast.error("Erro ao salvar a nova ordem dos estágios");
      fetchStages(); // Recarregar estágios originais em caso de erro
    }
  };

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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="stages-list">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {stages.map((stage, index) => (
                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center space-x-2 p-2 border rounded-md"
                        >
                          <div {...provided.dragHandleProps} className="cursor-move">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input
                            value={stage.name}
                            onChange={(e) => handleUpdateStage(stage, "name", e.target.value)}
                            className="flex-grow"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="w-10 h-10 p-0"
                                style={{ backgroundColor: stage.color }}
                              />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3">
                              <HexColorPicker
                                color={stage.color}
                                onChange={(color) => handleUpdateStage(stage, "color", color)}
                              />
                              <div className="grid grid-cols-4 gap-1 mt-2">
                                {DEFAULT_COLORS.map((color) => (
                                  <Button
                                    key={color}
                                    type="button"
                                    variant="outline"
                                    className="w-6 h-6 p-0 rounded-md"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleUpdateStage(stage, "color", color)}
                                  />
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStage(stage.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2">Adicionar novo estágio</h3>
            <div className="flex items-center space-x-2">
              <Input
                value={newStage.name}
                onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                placeholder="Nome do estágio"
                className="flex-grow"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-10 h-10 p-0"
                    style={{ backgroundColor: newStage.color }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <HexColorPicker
                    color={newStage.color}
                    onChange={(color) => setNewStage({ ...newStage, color })}
                  />
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {DEFAULT_COLORS.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant="outline"
                        className="w-6 h-6 p-0 rounded-md"
                        style={{ backgroundColor: color }}
                        onClick={() => setNewStage({ ...newStage, color })}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={handleAddStage} disabled={saving}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
