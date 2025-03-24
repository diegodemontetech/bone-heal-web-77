
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/utils/states";

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
  // Lista de estados do Brasil obtida do arquivo states.ts
  
  // Opções de grupos de clientes atualizadas conforme solicitado
  const customerGroupOptions = [
    { value: "all", label: "Todos os clientes" },
    { value: "first_purchase", label: "Primeira Compra" },
    { value: "vip", label: "Clientes VIP" },
    { value: "clinic", label: "Clínicas" },
    { value: "hospital", label: "Hospitais" },
    { value: "university", label: "Faculdades" },
    { value: "network", label: "Redes" }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Segmentação</h3>
      
      <div className="space-y-2">
        <Label htmlFor="region">Estado (UF)</Label>
        <Select
          value={region || "all"}
          onValueChange={onRegionChange}
        >
          <SelectTrigger id="region">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            <SelectItem value="all">Todos os estados</SelectItem>
            {states.map(state => (
              <SelectItem key={state.sigla} value={state.sigla}>
                {state.nome} ({state.sigla})
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
          <SelectContent className="max-h-[200px] overflow-y-auto">
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
