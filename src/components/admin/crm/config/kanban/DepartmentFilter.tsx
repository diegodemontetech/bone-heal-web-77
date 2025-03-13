
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DepartmentFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DepartmentFilter = ({ value, onValueChange }: DepartmentFilterProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por departamento" />
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
