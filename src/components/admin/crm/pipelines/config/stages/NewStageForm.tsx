
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ColorPickerPopover } from "./ColorPickerPopover";

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

interface StageFormData {
  name: string;
  color: string;
}

interface NewStageFormProps {
  onAdd: (data: StageFormData) => void;
  isLoading: boolean;
}

export const NewStageForm = ({ onAdd, isLoading }: NewStageFormProps) => {
  const [newStage, setNewStage] = useState<StageFormData>({
    name: "",
    color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
  });

  const handleSubmit = () => {
    onAdd(newStage);
    setNewStage({
      name: "",
      color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
    });
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="text-sm font-medium mb-2">Adicionar novo estágio</h3>
      <div className="flex items-center space-x-2">
        <Input
          value={newStage.name}
          onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
          placeholder="Nome do estágio"
          className="flex-grow"
        />
        <ColorPickerPopover
          color={newStage.color}
          onChange={(color) => setNewStage({ ...newStage, color })}
        />
        <Button onClick={handleSubmit} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};
