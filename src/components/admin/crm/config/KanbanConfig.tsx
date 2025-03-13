
import { useState } from "react";
import { DepartmentFilter } from "./kanban/DepartmentFilter";
import { AddStageButton } from "./kanban/AddStageButton";
import { StagesList } from "./kanban/StagesList";
import { StageForm } from "./kanban/StageForm";
import { useKanbanConfigState } from "./kanban/useKanbanConfigState";

const KanbanConfig = () => {
  const {
    stages,
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
  } = useKanbanConfigState();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuração do Kanban</h2>
        <div className="flex gap-3">
          <DepartmentFilter 
            value={departmentFilter} 
            onValueChange={setDepartmentFilter} 
          />
          
          <AddStageButton onClick={openNewDialog} />
        </div>
      </div>
      
      <StagesList 
        stages={stages} 
        onEdit={openEditDialog} 
        onDelete={handleDeleteStage} 
      />
      
      <StageForm 
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSave={editingStage ? handleEditStage : handleAddStage}
        editingStage={editingStage}
      />
    </div>
  );
};

export default KanbanConfig;
