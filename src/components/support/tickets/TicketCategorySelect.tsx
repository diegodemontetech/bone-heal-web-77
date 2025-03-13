
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TicketCategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TicketCategorySelect = ({ value, onValueChange }: TicketCategorySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Categoria</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="support">Suporte Técnico</SelectItem>
          <SelectItem value="sales">Vendas</SelectItem>
          <SelectItem value="logistics">Entregas (Logística)</SelectItem>
          <SelectItem value="financial">Financeiro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TicketCategorySelect;
