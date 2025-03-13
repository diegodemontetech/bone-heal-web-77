
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Tipos de campos disponíveis
const fieldTypes = [
  { id: "text", name: "Texto" },
  { id: "number", name: "Número" },
  { id: "date", name: "Data" },
  { id: "datetime", name: "Data e Hora" },
  { id: "currency", name: "Valor (R$)" },
  { id: "percent", name: "Percentual" },
  { id: "select", name: "Seleção" },
  { id: "multiselect", name: "Múltipla Escolha" },
  { id: "checkbox", name: "Caixa de Seleção" },
  { id: "timer", name: "Cronômetro" },
  { id: "phone", name: "Telefone" },
  { id: "email", name: "E-mail" },
  { id: "cpf", name: "CPF" },
  { id: "cnpj", name: "CNPJ" },
  { id: "cep", name: "CEP" }
];

// Campos iniciais mockados
const initialFields = [
  { id: "1", name: "Nome", type: "text", required: true, showInCard: true, showInKanban: true, department: "Vendas" },
  { id: "2", name: "Telefone", type: "phone", required: true, showInCard: true, showInKanban: true, department: "Vendas" },
  { id: "3", name: "E-mail", type: "email", required: false, showInCard: false, showInKanban: false, department: "Vendas" },
  { id: "4", name: "Valor", type: "currency", required: false, showInCard: true, showInKanban: true, department: "Vendas" },
  { id: "5", name: "Data de Contato", type: "date", required: false, showInCard: true, showInKanban: true, department: "Suporte" }
];

const FieldsConfig = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuração de Campos</h2>
        <div className="flex gap-3">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os departamentos</SelectItem>
              <SelectItem value="Vendas">Vendas</SelectItem>
              <SelectItem value="Suporte">Suporte</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Campo
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingField ? "Editar Campo" : "Novo Campo"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Campo</Label>
                  <Input 
                    id="name" 
                    value={editingField ? editingField.name : newField.name}
                    onChange={(e) => editingField 
                      ? setEditingField({...editingField, name: e.target.value})
                      : setNewField({...newField, name: e.target.value})
                    }
                    placeholder="Ex: Nome, Telefone, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={editingField ? editingField.type : newField.type}
                    onValueChange={(value) => editingField 
                      ? setEditingField({...editingField, type: value})
                      : setNewField({...newField, type: value})
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select 
                    value={editingField ? editingField.department : newField.department}
                    onValueChange={(value) => editingField 
                      ? setEditingField({...editingField, department: value})
                      : setNewField({...newField, department: value})
                    }
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Suporte">Suporte</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="required"
                    checked={editingField ? editingField.required : newField.required}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      editingField 
                        ? setEditingField({...editingField, required: isChecked})
                        : setNewField({...newField, required: isChecked});
                    }}
                  />
                  <Label htmlFor="required">Obrigatório</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showInCard"
                    checked={editingField ? editingField.showInCard : newField.showInCard}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      editingField 
                        ? setEditingField({...editingField, showInCard: isChecked})
                        : setNewField({...newField, showInCard: isChecked});
                    }}
                  />
                  <Label htmlFor="showInCard">Exibir no cartão</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showInKanban"
                    checked={editingField ? editingField.showInKanban : newField.showInKanban}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      editingField 
                        ? setEditingField({...editingField, showInKanban: isChecked})
                        : setNewField({...newField, showInKanban: isChecked});
                    }}
                  />
                  <Label htmlFor="showInKanban">Exibir no kanban</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingField ? handleEditField : handleAddField}>
                  {editingField ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead>No Cartão</TableHead>
              <TableHead>No Kanban</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>{fieldTypes.find(t => t.id === field.type)?.name || field.type}</TableCell>
                <TableCell>{field.department}</TableCell>
                <TableCell>{field.required ? "Sim" : "Não"}</TableCell>
                <TableCell>{field.showInCard ? "Sim" : "Não"}</TableCell>
                <TableCell>{field.showInKanban ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(field)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FieldsConfig;
