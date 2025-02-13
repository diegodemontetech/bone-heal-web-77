
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

interface UsersFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  contactTypeFilter: string | null;
  onContactTypeFilterChange: (value: string | null) => void;
}

export const UsersFilter = ({
  search,
  onSearchChange,
  contactTypeFilter,
  onContactTypeFilterChange,
}: UsersFilterProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="search">Pesquisar:</Label>
        <Input
          id="search"
          type="search"
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="contactTypeFilter">Tipo de Contato:</Label>
        <select
          id="contactTypeFilter"
          className="border rounded p-2"
          value={contactTypeFilter || ""}
          onChange={(e) => onContactTypeFilterChange(e.target.value || null)}
        >
          <option value="">Todos</option>
          <option value="customer">Clientes</option>
          <option value="supplier">Fornecedores</option>
          <option value="both">Cliente/Fornecedor</option>
        </select>
      </div>
      <Button onClick={() => onOpen("createUser")}>Criar Usuário</Button>
    </div>
  );
};
