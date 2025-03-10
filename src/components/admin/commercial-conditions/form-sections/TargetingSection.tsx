
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRAZILIAN_REGIONS = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
const CUSTOMER_GROUPS = ["Varejista", "Distribuidor", "Clínica", "Hospital", "Instituição Pública"];

interface TargetingSectionProps {
  region: string;
  customerGroup: string;
  onRegionChange: (value: string) => void;
  onCustomerGroupChange: (value: string) => void;
}

const TargetingSection = ({
  region,
  customerGroup,
  onRegionChange,
  onCustomerGroupChange
}: TargetingSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="region">Região (deixe em branco para todas)</Label>
        <Select
          value={region}
          onValueChange={onRegionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as regiões" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as regiões</SelectItem>
            {BRAZILIAN_REGIONS.map((region) => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer_group">Grupo de Clientes (deixe em branco para todos)</Label>
        <Select
          value={customerGroup}
          onValueChange={onCustomerGroupChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os grupos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os grupos</SelectItem>
            {CUSTOMER_GROUPS.map((group) => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TargetingSection;
