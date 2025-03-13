
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pipeline } from "@/types/crm";
import { Loader2 } from "lucide-react";

interface PipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pipeline: Pipeline | null;
}

const defaultFormData = {
  name: "",
  description: "",
  is_active: true
};

const PipelineDialog = ({ isOpen, onClose, onSuccess, pipeline }: PipelineDialogProps) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pipeline) {
      setFormData({
        name: pipeline.name,
        description: pipeline.description || "",
        is_active: pipeline.is_active !== false
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [pipeline, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        toast.error("O nome do pipeline é obrigatório");
        return;
      }

      if (pipeline) {
        // Atualizar pipeline existente
        const { error } = await supabase
          .from("crm_pipelines")
          .update({
            name: formData.name,
            description: formData.description || null,
            is_active: formData.is_active
          })
          .eq("id", pipeline.id);

        if (error) throw error;
        toast.success("Pipeline atualizado com sucesso");
      } else {
        // Criar novo pipeline
        const { error } = await supabase
          .from("crm_pipelines")
          .insert({
            name: formData.name,
            description: formData.description || null,
            is_active: formData.is_active
          });

        if (error) throw error;
        toast.success("Pipeline criado com sucesso");
      }

      onSuccess();
    } catch (err) {
      console.error("Erro ao salvar pipeline:", err);
      toast.error("Erro ao salvar pipeline");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{pipeline ? "Editar Pipeline" : "Novo Pipeline"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Pipeline</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Pipeline de Vendas"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o propósito deste pipeline..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active" className="cursor-pointer">Pipeline ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pipeline ? "Atualizar" : "Criar"} Pipeline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineDialog;
