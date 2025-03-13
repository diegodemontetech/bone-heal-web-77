
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddStageButtonProps {
  onClick: () => void;
}

export const AddStageButton = ({ onClick }: AddStageButtonProps) => {
  return (
    <Button onClick={onClick}>
      <Plus className="h-4 w-4 mr-2" />
      Nova Etapa
    </Button>
  );
};
