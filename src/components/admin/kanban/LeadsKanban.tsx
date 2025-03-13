
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import KanbanHeader from "./components/KanbanHeader";
import DepartmentTabs from "./components/DepartmentTabs";
import EmptyStageState from "./components/EmptyStageState";
import KanbanBoard from "./components/KanbanBoard";
import { useKanbanData } from "./hooks/useKanbanData";

const LeadsKanban = () => {
  const {
    loading,
    error,
    departments,
    stages,
    selectedDepartment,
    groupedLeads,
    handleChangeDepartment,
    handleLeadMove
  } = useKanbanData();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="p-4 h-full">
        <KanbanHeader />
        <EmptyStageState 
          message="Nenhum departamento configurado para o CRM"
          actionLabel="Configurar Departamentos"
          actionLink="/admin/leads/configuracoes"
        />
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <KanbanHeader />
      
      <DepartmentTabs 
        departments={departments}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={handleChangeDepartment}
      />

      {stages.length === 0 ? (
        <EmptyStageState 
          message="Nenhum estágio configurado para este departamento"
          actionLabel="Configurar Estágios"
          actionLink="/admin/crm/configuracoes"
        />
      ) : (
        <KanbanBoard 
          stages={stages}
          groupedLeads={groupedLeads}
          onLeadMove={handleLeadMove}
        />
      )}
    </div>
  );
};

export default LeadsKanban;
