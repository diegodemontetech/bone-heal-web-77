
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TargetingSectionProps {
  region: string | null;
  customerGroup: string | null;
  onRegionChange: (value: string) => void;
  onCustomerGroupChange: (value: string) => void;
}

const TargetingSection = ({
  region,
  customerGroup,
  onRegionChange,
  onCustomerGroupChange
}: TargetingSectionProps) => {
  // Opções de regiões do Brasil
  const regionOptions = [
    { value: "all", label: "Todas as regiões" },
    { value: "north", label: "Norte" },
    { value: "northeast", label: "Nordeste" },
    { value: "midwest", label: "Centro-Oeste" },
    { value: "southeast", label: "Sudeste" },
    { value: "south", label: "Sul" }
  ];
  
  // Opções de grupos de clientes
  const customerGroupOptions = [
    { value: "all", label: "Todos os clientes" },
    { value: "new", label: "Novos clientes" },
    { value: "vip", label: "Clientes VIP" },
    { value: "clinic", label: "Clínicas" },
    { value: "hospital", label: "Hospitais" }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Segmentação</h3>
      
      <div className="space-y-2">
        <Label htmlFor="region">Região</Label>
        <Select
          value={region || "all"}
          onValueChange={onRegionChange}
        >
          <SelectTrigger id="region">
            <SelectValue placeholder="Selecione uma região" />
          </SelectTrigger>
          <SelectContent>
            {regionOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="customer_group">Grupo de Clientes</Label>
        <Select
          value={customerGroup || "all"}
          onValueChange={onCustomerGroupChange}
        >
          <SelectTrigger id="customer_group">
            <SelectValue placeholder="Selecione um grupo" />
          </SelectTrigger>
          <SelectContent>
            {customerGroupOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TargetingSection;
