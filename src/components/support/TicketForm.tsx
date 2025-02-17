
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TicketFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TicketForm = ({ onSuccess, onCancel }: TicketFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("support_tickets").insert([
        {
          subject: formData.subject,
          description: formData.description,
          customer_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      if (error) throw error;

      toast.success("Chamado criado com sucesso!");
      onSuccess?.();
    } catch (error: any) {
      toast.error("Erro ao criar chamado: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="subject">Assunto</Label>
        <Input
          id="subject"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subject: e.target.value }))
          }
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          required
          rows={5}
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Chamado"}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
