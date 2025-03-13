
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StatusToggleProps {
  isActive: boolean;
  onToggle: (checked: boolean) => void;
}

export function StatusToggle({ isActive, onToggle }: StatusToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="is_active"
        checked={isActive}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="is_active">Automação Ativa</Label>
    </div>
  );
}
