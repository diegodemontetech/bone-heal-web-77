
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CRMField } from "@/types/crm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fieldTypes } from "@/components/admin/crm/config/fields/types";

interface FieldsConfigProps {
  pipelineId: string;
}

export const FieldsConfig = ({ pipelineId }: FieldsConfigProps) => {
  const [fields, setFields] = useState<CRMField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<CRMField | null>(null);
  
  // Definindo o tipo diretamente para evitar recursão infinita
  interface FieldFormData {
    name: string;
    label: string;
    type: string;
    required: boolean;
    display_in_kanban: boolean;
    options: string;
    mask: string;
    default_value: string;
  }
  
  const [formData, setFormData] = useState<FieldFormData>({
    name: "",
    label: "",
    type: "text",
    required: false,
    display_in_kanban: false,
    options: "",
    mask: "",
    default_value: ""
  });

  useEffect(() => {
    fetchFields();
  }, [pipelineId]);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_fields")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("created_at");

      if (error) throw error;
      setFields(data || []);
    } catch (err) {
      console.error("Erro ao buscar campos:", err);
      toast.error("Erro ao carregar campos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      label: "",
      type: "text",
      required: false,
      display_in_kanban: false,
      options: "",
      mask: "",
      default_value: ""
    });
    setCurrentField(null);
  };

  const handleOpenDialog = (field?: CRMField) => {
    if (field) {
      setCurrentField(field);
      setFormData({
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        display_in_kanban: field.display_in_kanban,
        options: field.options ? field.options.join(", ") : "",
        mask: field.mask || "",
        default_value: field.default_value || ""
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 300); // Reset after animation completes
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este campo?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("crm_fields")
        .delete()
        .eq("id", fieldId);

      if (error) throw error;

      setFields(fields.filter(field => field.id !== fieldId));
      toast.success("Campo excluído com sucesso");
    } catch (err) {
      console.error("Erro ao excluir campo:", err);
      toast.error("Erro ao excluir campo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validação básica
      if (!formData.name.trim() || !formData.label.trim()) {
        toast.error("Nome e rótulo são obrigatórios");
        return;
      }

      // Formatar as opções para array quando necessário
      let processedOptions = null;
      if (["select", "radio", "checkbox"].includes(formData.type) && formData.options) {
        processedOptions = formData.options.split(",").map(option => option.trim());
      }

      const fieldData = {
        name: formData.name,
        label: formData.label,
        type: formData.type,
        required: formData.required,
        display_in_kanban: formData.display_in_kanban,
        options: processedOptions,
        mask: formData.mask || null,
        default_value: formData.default_value || null,
        pipeline_id: pipelineId
      };

      if (currentField) {
        // Atualizar campo existente
        const { error } = await supabase
          .from("crm_fields")
          .update(fieldData)
          .eq("id", currentField.id);

        if (error) throw error;
        
        setFields(fields.map(field => 
          field.id === currentField.id ? { ...field, ...fieldData } : field
        ));
        
        toast.success("Campo atualizado com sucesso");
      } else {
        // Criar novo campo
        const { data, error } = await supabase
          .from("crm_fields")
          .insert(fieldData)
          .select()
          .single();

        if (error) throw error;
        
        setFields([...fields, data]);
        toast.success("Campo criado com sucesso");
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Erro ao salvar campo:", err);
      toast.error("Erro ao salvar campo");
    }
  };

  const getDefaultMask = (type: string) => {
    switch (type) {
      case "phone": return "(99) 99999-9999";
      case "cpf": return "999.999.999-99";
      case "cnpj": return "99.999.999/9999-99";
      case "cep": return "99999-999";
      case "money": return "R$ #.##0,00";
      default: return "";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campos do Pipeline</CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Novo Campo
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Configure os campos para capturar informações dos leads neste pipeline.
          </p>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : fields.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">Nenhum campo personalizado definido</p>
              <Button variant="outline" className="mt-4" onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Campo
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {fields.map(field => (
                <div 
                  key={field.id} 
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10"
                >
                  <div className="flex-1">
                    <div className="font-medium">{field.label}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{field.name}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {fieldTypes.find(t => t.value === field.type)?.label || field.type}
                      </span>
                      {field.required && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Obrigatório
                        </span>
                      )}
                      {field.display_in_kanban && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Exibir no Kanban
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenDialog(field)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteField(field.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={open => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentField ? "Editar Campo" : "Novo Campo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Interno</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="nome_campo"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Usado internamente (sem espaços)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label">Rótulo</Label>
                  <Input
                    id="label"
                    name="label"
                    placeholder="Nome visível"
                    value={formData.label}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Texto exibido no formulário
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Campo</Label>
                <Select
                  value={formData.type}
                  onValueChange={value => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {["select", "radio", "checkbox"].includes(formData.type) && (
                <div className="space-y-2">
                  <Label htmlFor="options">Opções</Label>
                  <Textarea
                    id="options"
                    name="options"
                    placeholder="Opção 1, Opção 2, Opção 3"
                    value={formData.options}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separe as opções por vírgula
                  </p>
                </div>
              )}

              {["phone", "cpf", "cnpj", "cep", "date", "money"].includes(formData.type) && (
                <div className="space-y-2">
                  <Label htmlFor="mask">Máscara</Label>
                  <Input
                    id="mask"
                    name="mask"
                    placeholder={getDefaultMask(formData.type)}
                    value={formData.mask}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="default_value">Valor Padrão</Label>
                <Input
                  id="default_value"
                  name="default_value"
                  placeholder="Valor padrão (opcional)"
                  value={formData.default_value}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={formData.required}
                  onCheckedChange={checked => handleSwitchChange("required", checked)}
                />
                <Label htmlFor="required" className="cursor-pointer">Campo obrigatório</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="display_in_kanban"
                  checked={formData.display_in_kanban}
                  onCheckedChange={checked => handleSwitchChange("display_in_kanban", checked)}
                />
                <Label htmlFor="display_in_kanban" className="cursor-pointer">Exibir no Kanban</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {currentField ? "Atualizar" : "Criar"} Campo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
