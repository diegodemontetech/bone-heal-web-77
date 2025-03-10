
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
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  statusFilter?: string;
  setStatusFilter?: (value: string) => void;
  
  // Novas propriedades adicionadas
  statusOptions?: Record<string, string>;
  priorityOptions?: Record<string, string>;
  agents?: Array<{ id: string; full_name: string }>;
  selectedStatus?: string | null;
  selectedPriority?: string | null;
  selectedAgent?: string | null;
  onStatusChange?: (value: string | null) => void;
  onPriorityChange?: (value: string | null) => void;
  onAgentChange?: (value: string | null) => void;
  onReset?: () => void;
}

const TicketFilters = ({
  searchQuery = "",
  setSearchQuery = () => {},
  statusFilter = "all",
  setStatusFilter = () => {},
  
  // Novas propriedades
  statusOptions,
  priorityOptions,
  agents = [],
  selectedStatus,
  selectedPriority,
  selectedAgent,
  onStatusChange,
  onPriorityChange,
  onAgentChange,
  onReset,
}: TicketFiltersProps) => {
  // Se estivermos usando o modo legado (searchQuery/statusFilter)
  const isLegacyMode = setSearchQuery !== (() => {});

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar tickets..."
          className="pl-10"
          value={isLegacyMode ? searchQuery : ""}
          onChange={isLegacyMode 
            ? (e) => setSearchQuery(e.target.value)
            : () => {}}
        />
      </div>
      
      {isLegacyMode ? (
        // Renderização do modo legado
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
      ) : (
        // Renderização do novo modo
        <div className="flex flex-col md:flex-row gap-3">
          {statusOptions && (
            <Select 
              value={selectedStatus || ""} 
              onValueChange={(value) => onStatusChange?.(value === "" ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                {Object.entries(statusOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {priorityOptions && (
            <Select 
              value={selectedPriority || ""} 
              onValueChange={(value) => onPriorityChange?.(value === "" ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as prioridades</SelectItem>
                {Object.entries(priorityOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {agents && agents.length > 0 && (
            <Select 
              value={selectedAgent || ""} 
              onValueChange={(value) => onAgentChange?.(value === "" ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os responsáveis</SelectItem>
                <SelectItem value="unassigned">Não atribuídos</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {onReset && (
            <button 
              onClick={onReset}
              className="text-sm text-primary hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketFilters;
