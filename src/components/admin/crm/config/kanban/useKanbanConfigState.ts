
import { useState } from "react";
import { toast } from "sonner";

const initialStages = [
  { id: "1", name: "Novo", color: "#3b82f6", department: "Vendas", order: 1 },
  { id: "2", name: "Contatado", color: "#10b981", department: "Vendas", order: 2 },
  { id: "3", name: "Proposta", color: "#f59e0b", department: "Vendas", order: 3 },
  { id: "4", name: "Fechado", color: "#6366f1", department: "Vendas", order: 4 },
  { id: "5", name: "Novo Ticket", color: "#3b82f6", department: "Suporte", order: 1 },
  { id: "6", name: "Em Andamento", color: "#f59e0b", department: "Suporte", order: 2 },
  { id: "7", name: "Resolvido", color: "#10b981", department: "Suporte", order: 3 }
];

interface Stage {
  id: string;
  name: string;
  color: string;
  department: string;
  order: number;
}

export const useKanbanConfigState = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const handleAddStage = (newStage: Omit<Stage, "id">) => {
    if (!newStage.name.trim()) {
      toast.error("O nome da etapa é obrigatório");
      return;
    }

    // Encontrar o maior order para o departamento selecionado
    const maxOrder = Math.max(
      ...stages
        .filter(stage => stage.department === newStage.department)
        .map(stage => stage.order),
      0
    );

    const stage = {
      id: Date.now().toString(),
      ...newStage,
      order: maxOrder + 1
    };

    setStages([...stages, stage]);
    toast.success("Etapa criada com sucesso!");
  };

  const handleEditStage = (updatedStage: Stage) => {
    if (!updatedStage.name.trim()) {
      toast.error("O nome da etapa é obrigatório");
      return;
    }

    setStages(stages.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ));
    
    toast.success("Etapa atualizada com sucesso!");
  };

  const handleDeleteStage = (id: string) => {
    setStages(stages.filter(stage => stage.id !== id));
    toast.success("Etapa removida com sucesso!");
  };

  const openEditDialog = (stage: Stage) => {
    setEditingStage(stage);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingStage(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Ordenar etapas por departamento e ordem
  const sortedStages = [...stages].sort((a, b) => {
    if (a.department !== b.department) {
      return a.department.localeCompare(b.department);
    }
    return a.order - b.order;
  });

  // Filtrar etapas por departamento
  const filteredStages = departmentFilter === "all" 
    ? sortedStages 
    : sortedStages.filter(stage => stage.department === departmentFilter);

  return {
    stages: filteredStages,
    editingStage,
    isDialogOpen,
    departmentFilter,
    setDepartmentFilter,
    handleAddStage,
    handleEditStage,
    handleDeleteStage,
    openEditDialog,
    openNewDialog,
    closeDialog
  };
};
