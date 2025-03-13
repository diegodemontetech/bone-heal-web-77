
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const KanbanHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Leads - Kanban</h1>
        <p className="text-muted-foreground">Gerencie seus leads de forma visual</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to="/admin/crm/configuracoes">
            Configurações
          </Link>
        </Button>
        <Button asChild>
          <Link to="/admin/leads/create">
            <Plus className="mr-2 h-4 w-4" /> Novo Lead
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default KanbanHeader;
