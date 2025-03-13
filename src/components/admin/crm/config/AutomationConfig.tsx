
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Automações iniciais mockadas
const initialAutomations = [
  { 
    id: "1", 
    name: "Envio de e-mail após 24h", 
    description: "Enviar e-mail de follow-up se o lead não for contatado em 24h",
    department: "Vendas",
    trigger: "time",
    triggerValue: "24",
    condition: "stage_equals",
    conditionValue: "Novo",
    action: "send_email",
    actionValue: "template_followup",
    isActive: true
  },
  { 
    id: "2", 
    name: "Notificação de lead fechado", 
    description: "Enviar notificação quando um lead for movido para a etapa Fechado",
    department: "Vendas",
    trigger: "stage_change",
    triggerValue: "Fechado",
    condition: "always",
    conditionValue: "",
    action: "send_notification",
    actionValue: "Gerente de Vendas",
    isActive: true
  },
  { 
    id: "3", 
    name: "Alerta de ticket sem resposta", 
    description: "Enviar alerta se um ticket permanecer sem resposta por mais de 48h",
    department: "Suporte",
    trigger: "time",
    triggerValue: "48",
    condition: "stage_equals",
    conditionValue: "Em Andamento",
    action: "create_alert",
    actionValue: "Suporte Técnico",
    isActive: false
  }
];

const AutomationConfig = () => {
  const [automations, setAutomations] = useState(initialAutomations);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    department: "Vendas",
    trigger: "time",
    triggerValue: "",
    condition: "always",
    conditionValue: "",
    action: "send_email",
    actionValue: "",
    isActive: true
  });
  const [editingAutomation, setEditingAutomation] = useState<null | typeof newAutomation & { id: string }>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const handleAddAutomation = () => {
    if (!newAutomation.name.trim()) {
      toast.error("O nome da automação é obrigatório");
      return;
    }

    const automation = {
      id: Date.now().toString(),
      ...newAutomation
    };

    setAutomations([...automations, automation]);
    setNewAutomation({
      name: "",
      description: "",
      department: "Vendas",
      trigger: "time",
      triggerValue: "",
      condition: "always",
      conditionValue: "",
      action: "send_email",
      actionValue: "",
      isActive: true
    });
    setIsDialogOpen(false);
    toast.success("Automação criada com sucesso!");
  };

  const handleEditAutomation = () => {
    if (!editingAutomation || !editingAutomation.name.trim()) {
      toast.error("O nome da automação é obrigatório");
      return;
    }

    setAutomations(automations.map(automation => 
      automation.id === editingAutomation.id ? editingAutomation : automation
    ));
    
    setEditingAutomation(null);
    setIsDialogOpen(false);
    toast.success("Automação atualizada com sucesso!");
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations(automations.filter(automation => automation.id !== id));
    toast.success("Automação removida com sucesso!");
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations(automations.map(automation => 
      automation.id === id ? { ...automation, isActive: !automation.isActive } : automation
    ));
  };

  const openEditDialog = (automation: typeof editingAutomation) => {
    setEditingAutomation(automation);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingAutomation(null);
    setNewAutomation({
      name: "",
      description: "",
      department: "Vendas",
      trigger: "time",
      triggerValue: "",
      condition: "always",
      conditionValue: "",
      action: "send_email",
      actionValue: "",
      isActive: true
    });
    setIsDialogOpen(true);
  };

  // Filtrar automações por departamento
  const filteredAutomations = departmentFilter === "all" 
    ? automations 
    : automations.filter(automation => automation.department === departmentFilter);

  // Função para obter o nome descritivo do trigger
  const getTriggerName = (trigger: string) => {
    switch (trigger) {
      case 'time': return 'Tempo na etapa';
      case 'stage_change': return 'Mudança de etapa';
      case 'field_change': return 'Mudança de campo';
      case 'creation': return 'Criação';
      default: return trigger;
    }
  };

  // Função para obter o nome descritivo da ação
  const getActionName = (action: string) => {
    switch (action) {
      case 'send_email': return 'Enviar e-mail';
      case 'send_notification': return 'Enviar notificação';
      case 'create_alert': return 'Criar alerta';
      case 'change_stage': return 'Mudar etapa';
      case 'assign_user': return 'Atribuir usuário';
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuração de Automações</h2>
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
                Nova Automação
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAutomation ? "Editar Automação" : "Nova Automação"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    value={editingAutomation ? editingAutomation.name : newAutomation.name}
                    onChange={(e) => editingAutomation 
                      ? setEditingAutomation({...editingAutomation, name: e.target.value})
                      : setNewAutomation({...newAutomation, name: e.target.value})
                    }
                    placeholder="Nome da automação"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    value={editingAutomation ? editingAutomation.description : newAutomation.description}
                    onChange={(e) => editingAutomation 
                      ? setEditingAutomation({...editingAutomation, description: e.target.value})
                      : setNewAutomation({...newAutomation, description: e.target.value})
                    }
                    placeholder="Descrição da automação"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select 
                    value={editingAutomation ? editingAutomation.department : newAutomation.department}
                    onValueChange={(value) => editingAutomation 
                      ? setEditingAutomation({...editingAutomation, department: value})
                      : setNewAutomation({...newAutomation, department: value})
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trigger">Gatilho</Label>
                    <Select 
                      value={editingAutomation ? editingAutomation.trigger : newAutomation.trigger}
                      onValueChange={(value) => editingAutomation 
                        ? setEditingAutomation({...editingAutomation, trigger: value})
                        : setNewAutomation({...newAutomation, trigger: value})
                      }
                    >
                      <SelectTrigger id="trigger">
                        <SelectValue placeholder="Selecione o gatilho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="time">Tempo na etapa</SelectItem>
                        <SelectItem value="stage_change">Mudança de etapa</SelectItem>
                        <SelectItem value="field_change">Mudança de campo</SelectItem>
                        <SelectItem value="creation">Criação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="triggerValue">Valor do Gatilho</Label>
                    <Input 
                      id="triggerValue" 
                      value={editingAutomation ? editingAutomation.triggerValue : newAutomation.triggerValue}
                      onChange={(e) => editingAutomation 
                        ? setEditingAutomation({...editingAutomation, triggerValue: e.target.value})
                        : setNewAutomation({...newAutomation, triggerValue: e.target.value})
                      }
                      placeholder={
                        (editingAutomation?.trigger || newAutomation.trigger) === 'time' 
                          ? 'Horas (ex: 24)' 
                          : 'Valor'
                      }
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condição</Label>
                    <Select 
                      value={editingAutomation ? editingAutomation.condition : newAutomation.condition}
                      onValueChange={(value) => editingAutomation 
                        ? setEditingAutomation({...editingAutomation, condition: value})
                        : setNewAutomation({...newAutomation, condition: value})
                      }
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Selecione a condição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Sempre</SelectItem>
                        <SelectItem value="stage_equals">Etapa igual</SelectItem>
                        <SelectItem value="field_equals">Campo igual</SelectItem>
                        <SelectItem value="field_not_empty">Campo não vazio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conditionValue">Valor da Condição</Label>
                    <Input 
                      id="conditionValue" 
                      value={editingAutomation ? editingAutomation.conditionValue : newAutomation.conditionValue}
                      onChange={(e) => editingAutomation 
                        ? setEditingAutomation({...editingAutomation, conditionValue: e.target.value})
                        : setNewAutomation({...newAutomation, conditionValue: e.target.value})
                      }
                      placeholder="Valor"
                      disabled={(editingAutomation?.condition || newAutomation.condition) === 'always'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="action">Ação</Label>
                    <Select 
                      value={editingAutomation ? editingAutomation.action : newAutomation.action}
                      onValueChange={(value) => editingAutomation 
                        ? setEditingAutomation({...editingAutomation, action: value})
                        : setNewAutomation({...newAutomation, action: value})
                      }
                    >
                      <SelectTrigger id="action">
                        <SelectValue placeholder="Selecione a ação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_email">Enviar e-mail</SelectItem>
                        <SelectItem value="send_notification">Enviar notificação</SelectItem>
                        <SelectItem value="create_alert">Criar alerta</SelectItem>
                        <SelectItem value="change_stage">Mudar etapa</SelectItem>
                        <SelectItem value="assign_user">Atribuir usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="actionValue">Valor da Ação</Label>
                    <Input 
                      id="actionValue" 
                      value={editingAutomation ? editingAutomation.actionValue : newAutomation.actionValue}
                      onChange={(e) => editingAutomation 
                        ? setEditingAutomation({...editingAutomation, actionValue: e.target.value})
                        : setNewAutomation({...newAutomation, actionValue: e.target.value})
                      }
                      placeholder="Valor da ação"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="isActive"
                    checked={editingAutomation ? editingAutomation.isActive : newAutomation.isActive}
                    onCheckedChange={(checked) => {
                      editingAutomation 
                        ? setEditingAutomation({...editingAutomation, isActive: checked})
                        : setNewAutomation({...newAutomation, isActive: checked});
                    }}
                  />
                  <Label htmlFor="isActive">Ativo</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingAutomation ? handleEditAutomation : handleAddAutomation}>
                  {editingAutomation ? "Salvar" : "Adicionar"}
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
              <TableHead>Departamento</TableHead>
              <TableHead>Gatilho</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAutomations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhuma automação encontrada para este departamento
                </TableCell>
              </TableRow>
            ) : (
              filteredAutomations.map((automation) => (
                <TableRow key={automation.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{automation.name}</p>
                      <p className="text-xs text-muted-foreground">{automation.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{automation.department}</TableCell>
                  <TableCell>
                    <div>
                      <p>{getTriggerName(automation.trigger)}</p>
                      {automation.triggerValue && (
                        <p className="text-xs text-muted-foreground">
                          {automation.trigger === 'time' ? `${automation.triggerValue}h` : automation.triggerValue}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{getActionName(automation.action)}</p>
                      {automation.actionValue && (
                        <p className="text-xs text-muted-foreground">{automation.actionValue}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={automation.isActive}
                      onCheckedChange={() => handleToggleAutomation(automation.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(automation)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAutomation(automation.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AutomationConfig;
