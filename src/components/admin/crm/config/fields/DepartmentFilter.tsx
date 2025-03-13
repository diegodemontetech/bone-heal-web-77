
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DepartmentFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const DepartmentFilter = ({ value, onChange }: DepartmentFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Todos os departamentos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os departamentos</SelectItem>
        <SelectItem value="Vendas">Vendas</SelectItem>
        <SelectItem value="Suporte">Suporte</SelectItem>
        <SelectItem value="Marketing">Marketing</SelectItem>
      </SelectContent>
    </Select>
  );
};
