
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TicketFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const TicketFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: TicketFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar tickets..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tickets</SelectItem>
          <SelectItem value="open">Abertos</SelectItem>
          <SelectItem value="in_progress">Em andamento</SelectItem>
          <SelectItem value="resolved">Resolvidos</SelectItem>
          <SelectItem value="closed">Fechados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TicketFilters;
