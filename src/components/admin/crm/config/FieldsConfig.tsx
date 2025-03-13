
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFieldsConfig } from "./fields/useFieldsConfig";
import { FieldsTable } from "./fields/FieldsTable";
import { DepartmentFilter } from "./fields/DepartmentFilter";
import { FieldDialog } from "./fields/FieldDialog";
import { FieldForm } from "./fields/FieldForm";

const FieldsConfig = () => {
  const {
    fields,
    newField,
    editingField,
    isDialogOpen,
    departmentFilter,
    setNewField,
    setEditingField,
    setDepartmentFilter,
    setIsDialogOpen,
    handleAddField,
    handleEditField,
    handleDeleteField,
    openEditDialog,
    openNewDialog
  } = useFieldsConfig();

  // Função auxiliar para atualizar o campo sendo editado ou novo campo
  const handleFieldChange = (field: string, value: any) => {
    if (editingField) {
      setEditingField({
        ...editingField,
        [field]: value
      });
    } else {
      setNewField({
        ...newField,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuração de Campos</h2>
        <div className="flex gap-3">
          <DepartmentFilter 
            value={departmentFilter} 
            onChange={setDepartmentFilter} 
          />
          
          <Button onClick={openNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Campo
          </Button>
        </div>
      </div>
      
      <Card>
        <FieldsTable 
          fields={fields} 
          onEdit={openEditDialog} 
          onDelete={handleDeleteField} 
        />
      </Card>
      
      <FieldDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        title={editingField ? "Editar Campo" : "Novo Campo"}
      >
        <FieldForm
          data={editingField || newField}
          onChange={handleFieldChange}
          onSubmit={editingField ? handleEditField : handleAddField}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingField ? "Salvar" : "Adicionar"}
        />
      </FieldDialog>
    </div>
  );
};

export default FieldsConfig;
