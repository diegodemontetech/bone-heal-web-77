
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface InstanceNameInputProps {
  instanceName: string;
  setInstanceName: (name: string) => void;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export const InstanceNameInput = ({ value, onChange, disabled = false }: InstanceNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="instance-name">Nome da Instância</Label>
      <Input
        id="instance-name"
        placeholder="Ex: principal, atendimento, vendas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <p className="text-sm text-muted-foreground">
        Escolha um nome único para identificar esta instância
      </p>
    </div>
  );
};
