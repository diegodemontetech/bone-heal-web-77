
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTicketFormProps {
  onSuccess: () => void;
}

const CreateTicketForm = ({ onSuccess }: CreateTicketFormProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "normal",
    customer_id: null as string | null
  });

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("is_admin", false)
        .order("full_name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("support_tickets")
        .insert([{
          title: formData.title,
          description: formData.description,
          status: "open",
          priority: formData.priority,
          customer_id: formData.customer_id,
          created_by: profile?.id,
          assigned_to: profile?.id
        }]);

      if (error) throw error;

      toast.success("Ticket criado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast.error("Erro ao criar ticket. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer_id">Cliente</Label>
        <Select
          value={formData.customer_id || ""}
          onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value || null }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers?.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.full_name || customer.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Prioridade</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          required
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Ticket"}
      </Button>
    </form>
  );
};

export default CreateTicketForm;
