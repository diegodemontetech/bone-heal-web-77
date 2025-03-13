
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash2 } from "lucide-react";
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

const KanbanConfig = () => {
  const [stages, setStages] = useState(initialStages);
  const [newStage, setNewStage] = useState({ name: "", color: "#3b82f6", department: "Vendas", order: 0 });
  const [editingStage, setEditingStage] = useState<null | { id: string, name: string, color: string, department: string, order: number }>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const handleAddStage = () => {
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
    setNewStage({ name: "", color: "#3b82f6", department: "Vendas", order: 0 });
    setIsDialogOpen(false);
    toast.success("Etapa criada com sucesso!");
  };

  const handleEditStage = () => {
    if (!editingStage || !editingStage.name.trim()) {
      toast.error("O nome da etapa é obrigatório");
      return;
    }

    setStages(stages.map(stage => 
      stage.id === editingStage.id ? editingStage : stage
    ));
    
    setEditingStage(null);
    setIsDialogOpen(false);
    toast.success("Etapa atualizada com sucesso!");
  };

  const handleDeleteStage = (id: string) => {
    setStages(stages.filter(stage => stage.id !== id));
    toast.success("Etapa removida com sucesso!");
  };

  const openEditDialog = (stage: typeof editingStage) => {
    setEditingStage(stage);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingStage(null);
    setNewStage({ name: "", color: "#3b82f6", department: "Vendas", order: 0 });
    setIsDialogOpen(true);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuração do Kanban</h2>
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
                Nova Etapa
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingStage ? "Editar Etapa" : "Nova Etapa"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Etapa</Label>
                  <Input 
                    id="name" 
                    value={editingStage ? editingStage.name : newStage.name}
                    onChange={(e) => editingStage 
                      ? setEditingStage({...editingStage, name: e.target.value})
                      : setNewStage({...newStage, name: e.target.value})
                    }
                    placeholder="Ex: Novo, Em Progresso, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select 
                    value={editingStage ? editingStage.department : newStage.department}
                    onValueChange={(value) => editingStage 
                      ? setEditingStage({...editingStage, department: value})
                      : setNewStage({...newStage, department: value})
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
                
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <div className="flex gap-3 items-center">
                    <Input 
                      id="color" 
                      type="color"
                      value={editingStage ? editingStage.color : newStage.color}
                      onChange={(e) => editingStage 
                        ? setEditingStage({...editingStage, color: e.target.value})
                        : setNewStage({...newStage, color: e.target.value})
                      }
                      className="w-16 h-10 p-1"
                    />
                    <Input 
                      type="text"
                      value={editingStage ? editingStage.color : newStage.color}
                      onChange={(e) => editingStage 
                        ? setEditingStage({...editingStage, color: e.target.value})
                        : setNewStage({...newStage, color: e.target.value})
                      }
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                {editingStage && (
                  <div className="space-y-2">
                    <Label htmlFor="order">Ordem</Label>
                    <Input 
                      id="order" 
                      type="number"
                      min="1"
                      value={editingStage.order}
                      onChange={(e) => setEditingStage({
                        ...editingStage, 
                        order: parseInt(e.target.value) || 1
                      })}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingStage ? handleEditStage : handleAddStage}>
                  {editingStage ? "Salvar" : "Adicionar"}
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
              <TableHead>Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStages.map((stage) => (
              <TableRow key={stage.id}>
                <TableCell>{stage.order}</TableCell>
                <TableCell className="font-medium">{stage.name}</TableCell>
                <TableCell>{stage.department}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span>{stage.color}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(stage)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteStage(stage.id)}
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

export default KanbanConfig;
