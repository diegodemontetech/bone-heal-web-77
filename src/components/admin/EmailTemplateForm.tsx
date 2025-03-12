import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { EmailTemplate } from "@/types/email";

interface EmailTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  template?: EmailTemplate;
  onSuccess?: () => void;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  isOpen,
  onClose,
  template,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [templateData, setTemplateData] = useState<Partial<EmailTemplate>>({
    name: "",
    subject: "",
    body: "",
    event_type: "order_created",
    variables: [],
  });

  useEffect(() => {
    if (template) {
      setTemplateData({
        name: template.name,
        subject: template.subject,
        body: template.body,
        event_type: template.event_type,
        variables: template.variables || [],
      });
    } else {
      setTemplateData({
        name: "",
        subject: "",
        body: "",
        event_type: "order_created",
        variables: [],
      });
    }
  }, [template, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (template?.id) {
        // Update existing template
        const { error } = await supabase
          .from("email_templates")
          .update({
            name: templateData.name || 'Novo template', 
            body: templateData.body || 'Conteúdo do template',
            subject: templateData.subject || 'Assunto do template', 
            event_type: templateData.event_type || 'generic',
            variables: templateData.variables || []
          })
          .eq("id", template.id);

        if (error) throw error;
        toast.success("Template atualizado com sucesso!");
      } else {
        // Create new template
        const { error } = await supabase.from('email_templates').insert({
          name: templateData.name || 'Novo template', 
          body: templateData.body || 'Conteúdo do template',
          subject: templateData.subject || 'Assunto do template', 
          event_type: templateData.event_type || 'generic',
          variables: templateData.variables || []
        });

        if (error) throw error;
        toast.success("Template criado com sucesso!");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar template:", error);
      toast.error(`Erro ao salvar template: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTemplateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVariable = () => {
    setTemplateData((prev) => ({
      ...prev,
      variables: [...(prev.variables || []), { name: "", description: "" }],
    }));
  };

  const handleVariableChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setTemplateData((prev) => {
      const variables = [...(prev.variables || [])];
      variables[index] = { ...variables[index], [field]: value };
      return { ...prev, variables };
    });
  };

  const handleRemoveVariable = (index: number) => {
    setTemplateData((prev) => {
      const variables = [...(prev.variables || [])];
      variables.splice(index, 1);
      return { ...prev, variables };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {template ? "Editar Template" : "Novo Template"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Template</Label>
            <Input
              id="name"
              name="name"
              value={templateData.name || ""}
              onChange={handleChange}
              placeholder="Ex: Confirmação de Pedido"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_type">Tipo de Evento</Label>
            <Select
              value={templateData.event_type}
              onValueChange={(value) =>
                handleSelectChange("event_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order_created">Pedido Criado</SelectItem>
                <SelectItem value="order_paid">Pagamento Confirmado</SelectItem>
                <SelectItem value="order_shipped">Pedido Enviado</SelectItem>
                <SelectItem value="order_delivered">Pedido Entregue</SelectItem>
                <SelectItem value="order_canceled">Pedido Cancelado</SelectItem>
                <SelectItem value="welcome">Boas-vindas</SelectItem>
                <SelectItem value="password_reset">Redefinição de Senha</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto do Email</Label>
            <Input
              id="subject"
              name="subject"
              value={templateData.subject || ""}
              onChange={handleChange}
              placeholder="Ex: Seu pedido foi confirmado"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Conteúdo do Email</Label>
            <Textarea
              id="body"
              name="body"
              value={templateData.body || ""}
              onChange={handleChange}
              placeholder="Conteúdo do email com marcadores HTML..."
              rows={10}
              required
            />
            <p className="text-xs text-muted-foreground">
              Você pode usar HTML e variáveis como {"{nome}"}, {"{pedido_id}"},
              etc.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Variáveis Disponíveis</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariable}
              >
                Adicionar Variável
              </Button>
            </div>

            <div className="space-y-2">
              {templateData.variables?.map((variable, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 border p-2 rounded-md"
                >
                  <Input
                    value={variable.name || ""}
                    onChange={(e) =>
                      handleVariableChange(index, "name", e.target.value)
                    }
                    placeholder="Nome da variável"
                    className="flex-1"
                  />
                  <Input
                    value={variable.description || ""}
                    onChange={(e) =>
                      handleVariableChange(index, "description", e.target.value)
                    }
                    placeholder="Descrição"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveVariable(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {template ? "Atualizar" : "Criar"} Template
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplateForm;
