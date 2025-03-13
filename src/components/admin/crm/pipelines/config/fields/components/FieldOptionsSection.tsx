
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FieldOptionsSectionProps {
  required: boolean;
  displayInKanban: boolean;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export const FieldOptionsSection = ({ 
  required, 
  displayInKanban, 
  onSwitchChange 
}: FieldOptionsSectionProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={required}
          onCheckedChange={checked => onSwitchChange("required", checked)}
        />
        <Label htmlFor="required" className="cursor-pointer">Campo obrigatório</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="display_in_kanban"
          checked={displayInKanban}
          onCheckedChange={checked => onSwitchChange("display_in_kanban", checked)}
        />
        <Label htmlFor="display_in_kanban" className="cursor-pointer">Exibir no Kanban</Label>
      </div>
    </>
  );
};
