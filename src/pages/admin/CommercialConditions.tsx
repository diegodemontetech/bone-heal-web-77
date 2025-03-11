
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Trash, Edit, Users, Calendar, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CommercialCondition {
  id: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_purchase_value: number;
  min_purchase_quantity: number;
  target_customer_group: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

const CommercialConditions = () => {
  const [conditions, setConditions] = useState<CommercialCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCondition, setCurrentCondition] = useState<CommercialCondition | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase_value: "",
    min_purchase_quantity: "",
    target_customer_group: "all",
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: "",
    is_active: true
  });

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("commercial_conditions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConditions(data || []);
    } catch (error) {
      console.error("Erro ao buscar condições comerciais:", error);
      toast.error("Erro ao carregar condições comerciais");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = (e.target as HTMLInputElement).type === "checkbox";
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      min_purchase_value: "",
      min_purchase_quantity: "",
      target_customer_group: "all",
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: "",
      is_active: true
    });
    setIsEditing(false);
    setCurrentCondition(null);
  };

  const openEditDialog = (condition: CommercialCondition) => {
    setCurrentCondition(condition);
    setFormData({
      name: condition.name,
      description: condition.description,
      discount_type: condition.discount_type,
      discount_value: condition.discount_value.toString(),
      min_purchase_value: condition.min_purchase_value.toString(),
      min_purchase_quantity: condition.min_purchase_quantity.toString(),
      target_customer_group: condition.target_customer_group,
      valid_from: new Date(condition.valid_from).toISOString().split('T')[0],
      valid_until: condition.valid_until ? new Date(condition.valid_until).toISOString().split('T')[0] : "",
      is_active: condition.is_active
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSaveCondition = async () => {
    try {
      if (!formData.name || !formData.discount_value) {
        toast.error("Por favor, preencha pelo menos o nome e o valor do desconto");
        return;
      }

      const conditionData = {
        name: formData.name,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_purchase_value: Number(formData.min_purchase_value) || 0,
        min_purchase_quantity: Number(formData.min_purchase_quantity) || 0,
        target_customer_group: formData.target_customer_group,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        is_active: formData.is_active
      };

      if (isEditing && currentCondition) {
        // Atualizar condição existente
        const { error } = await supabase
          .from("commercial_conditions")
          .update(conditionData)
          .eq("id", currentCondition.id);

        if (error) throw error;
        toast.success("Condição comercial atualizada com sucesso!");
      } else {
        // Criar nova condição
        const { error } = await supabase
          .from("commercial_conditions")
          .insert([conditionData]);

        if (error) throw error;
        toast.success("Condição comercial criada com sucesso!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchConditions();
    } catch (error: any) {
      console.error("Erro ao salvar condição comercial:", error);
      toast.error(`Erro ao salvar condição comercial: ${error.message}`);
    }
  };

  const handleDeleteCondition = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta condição comercial?")) return;

    try {
      const { error } = await supabase
        .from("commercial_conditions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Condição comercial excluída com sucesso!");
      fetchConditions();
    } catch (error: any) {
      console.error("Erro ao excluir condição comercial:", error);
      toast.error(`Erro ao excluir condição comercial: ${error.message}`);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tag className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Condições Comerciais</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Condição
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Condição Comercial" : "Criar Nova Condição Comercial"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Condição</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Desconto para Clínicas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva a condição comercial"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Tipo de Desconto</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value) => handleSelectChange("discount_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentual</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    {formData.discount_type === "percentage" ? "Desconto (%)" : "Desconto (R$)"}
                  </Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={handleInputChange}
                    placeholder={formData.discount_type === "percentage" ? "Ex: 10" : "Ex: 50.00"}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_purchase_value">Compra Mínima (R$)</Label>
                  <Input
                    id="min_purchase_value"
                    name="min_purchase_value"
                    type="number"
                    value={formData.min_purchase_value}
                    onChange={handleInputChange}
                    placeholder="Ex: 200.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min_purchase_quantity">Quantidade Mínima</Label>
                  <Input
                    id="min_purchase_quantity"
                    name="min_purchase_quantity"
                    type="number"
                    value={formData.min_purchase_quantity}
                    onChange={handleInputChange}
                    placeholder="Ex: 5"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target_customer_group">Grupo de Clientes</Label>
                <Select
                  value={formData.target_customer_group}
                  onValueChange={(value) => handleSelectChange("target_customer_group", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Clientes</SelectItem>
                    <SelectItem value="clinics">Clínicas</SelectItem>
                    <SelectItem value="hospitals">Hospitais</SelectItem>
                    <SelectItem value="distributors">Distribuidores</SelectItem>
                    <SelectItem value="vip">Clientes VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valid_from">Válido de</Label>
                  <Input
                    id="valid_from"
                    name="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valid_until">Válido até</Label>
                  <Input
                    id="valid_until"
                    name="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleInputChange as any}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_active">Condição Ativa</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveCondition}>
                  {isEditing ? "Atualizar" : "Criar"} Condição
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Condições Comerciais</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conditions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma condição comercial encontrada. Crie sua primeira condição.</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Condição
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Público-Alvo</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conditions.map((condition) => (
                  <TableRow key={condition.id}>
                    <TableCell className="font-medium">{condition.name}</TableCell>
                    <TableCell>
                      {condition.discount_type === "percentage" 
                        ? `${condition.discount_value}%` 
                        : `R$ ${condition.discount_value.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {condition.target_customer_group === "all" ? "Todos os Clientes" : 
                          condition.target_customer_group === "clinics" ? "Clínicas" :
                          condition.target_customer_group === "hospitals" ? "Hospitais" :
                          condition.target_customer_group === "distributors" ? "Distribuidores" : 
                          condition.target_customer_group === "vip" ? "Clientes VIP" : 
                          condition.target_customer_group}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(condition.valid_from)} 
                        {condition.valid_until && ` até ${formatDate(condition.valid_until)}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        condition.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {condition.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openEditDialog(condition)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteCondition(condition.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommercialConditions;
