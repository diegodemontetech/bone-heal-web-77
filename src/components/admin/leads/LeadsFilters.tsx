
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LeadsFiltersProps {
  selectedStatus: string | null;
  selectedSource: string | null;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

const LeadsFilters = ({ 
  selectedStatus, 
  selectedSource, 
  onStatusChange, 
  onSourceChange 
}: LeadsFiltersProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Status</label>
          <Select
            value={selectedStatus || "all"}
            onValueChange={(value) => onStatusChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="contacted">Contatado</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Origem</label>
          <Select
            value={selectedSource || "all"}
            onValueChange={(value) => onSourceChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="whatsapp_widget">WhatsApp</SelectItem>
              <SelectItem value="contact_form">Formulário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate('/admin/crm/hunting')}
        variant="default"
      >
        Ver no CRM
      </Button>
    </div>
  );
};

export default LeadsFilters;
