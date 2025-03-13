
import { useState } from "react";
import { toast } from "sonner";
import { fieldTypes } from "./types";

export const useFieldsConfig = () => {
  // Campos iniciais mockados
  const initialFields = [
    { id: "1", name: "Nome", type: "text", required: true, showInCard: true, showInKanban: true, department: "Vendas" },
    { id: "2", name: "Telefone", type: "phone", required: true, showInCard: true, showInKanban: true, department: "Vendas" },
    { id: "3", name: "E-mail", type: "email", required: false, showInCard: false, showInKanban: false, department: "Vendas" },
    { id: "4", name: "Valor", type: "currency", required: false, showInCard: true, showInKanban: true, department: "Vendas" },
    { id: "5", name: "Data de Contato", type: "date", required: false, showInCard: true, showInKanban: true, department: "Suporte" }
  ];

  const [fields, setFields] = useState(initialFields);
  const [newField, setNewField] = useState({
    name: "",
    type: "text",
    required: false,
    showInCard: false,
    showInKanban: false,
    department: "Vendas"
  });
  const [editingField, setEditingField] = useState<null | {
    id: string,
    name: string,
    type: string,
    required: boolean,
    showInCard: boolean,
    showInKanban: boolean,
    department: string
  }>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const handleAddField = () => {
    if (!newField.name.trim()) {
      toast.error("O nome do campo é obrigatório");
      return;
    }

    const field = {
      id: Date.now().toString(),
      ...newField
    };

    setFields([...fields, field]);
    setNewField({
      name: "",
      type: "text",
      required: false,
      showInCard: false,
      showInKanban: false,
      department: "Vendas"
    });
    setIsDialogOpen(false);
    toast.success("Campo criado com sucesso!");
  };

  const handleEditField = () => {
    if (!editingField || !editingField.name.trim()) {
      toast.error("O nome do campo é obrigatório");
      return;
    }

    setFields(fields.map(field => 
      field.id === editingField.id ? editingField : field
    ));
    
    setEditingField(null);
    setIsDialogOpen(false);
    toast.success("Campo atualizado com sucesso!");
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    toast.success("Campo removido com sucesso!");
  };

  const openEditDialog = (field: typeof editingField) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingField(null);
    setNewField({
      name: "",
      type: "text",
      required: false,
      showInCard: false,
      showInKanban: false,
      department: "Vendas"
    });
    setIsDialogOpen(true);
  };

  // Filtrar campos por departamento
  const filteredFields = departmentFilter === "all" 
    ? fields 
    : fields.filter(field => field.department === departmentFilter);

  return {
    fields: filteredFields,
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
  };
};
