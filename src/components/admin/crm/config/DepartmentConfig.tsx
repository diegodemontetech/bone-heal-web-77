
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Dados mockados para departamentos
const initialDepartments = [
  { id: "1", name: "Vendas", description: "Equipe de vendas", icon: "ShoppingCart" },
  { id: "2", name: "Suporte", description: "Atendimento ao cliente", icon: "MessageCircle" },
  { id: "3", name: "Marketing", description: "Equipe de marketing", icon: "BarChart2" }
];

const DepartmentConfig = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [newDepartment, setNewDepartment] = useState({ name: "", description: "", icon: "" });
  const [editingDepartment, setEditingDepartment] = useState<null | { id: string, name: string, description: string, icon: string }>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim()) {
      toast.error("O nome do departamento é obrigatório");
      return;
    }

    const department = {
      id: Date.now().toString(),
      ...newDepartment
    };

    setDepartments([...departments, department]);
    setNewDepartment({ name: "", description: "", icon: "" });
    setIsDialogOpen(false);
    toast.success("Departamento criado com sucesso!");
  };

  const handleEditDepartment = () => {
    if (!editingDepartment || !editingDepartment.name.trim()) {
      toast.error("O nome do departamento é obrigatório");
      return;
    }

    setDepartments(departments.map(dept => 
      dept.id === editingDepartment.id ? editingDepartment : dept
    ));
    
    setEditingDepartment(null);
    setIsDialogOpen(false);
    toast.success("Departamento atualizado com sucesso!");
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    toast.success("Departamento removido com sucesso!");
  };

  const openEditDialog = (department: typeof editingDepartment) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingDepartment(null);
    setNewDepartment({ name: "", description: "", icon: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Departamentos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Departamento
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? "Editar Departamento" : "Novo Departamento"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={editingDepartment ? editingDepartment.name : newDepartment.name}
                  onChange={(e) => editingDepartment 
                    ? setEditingDepartment({...editingDepartment, name: e.target.value})
                    : setNewDepartment({...newDepartment, name: e.target.value})
                  }
                  placeholder="Ex: Vendas, Suporte, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description" 
                  value={editingDepartment ? editingDepartment.description : newDepartment.description}
                  onChange={(e) => editingDepartment 
                    ? setEditingDepartment({...editingDepartment, description: e.target.value})
                    : setNewDepartment({...newDepartment, description: e.target.value})
                  }
                  placeholder="Descrição do departamento"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone</Label>
                <Input 
                  id="icon" 
                  value={editingDepartment ? editingDepartment.icon : newDepartment.icon}
                  onChange={(e) => editingDepartment 
                    ? setEditingDepartment({...editingDepartment, icon: e.target.value})
                    : setNewDepartment({...newDepartment, icon: e.target.value})
                  }
                  placeholder="Ex: ShoppingCart, MessageCircle, etc."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={editingDepartment ? handleEditDepartment : handleAddDepartment}>
                {editingDepartment ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ícone</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.icon}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(department)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteDepartment(department.id)}
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

export default DepartmentConfig;
