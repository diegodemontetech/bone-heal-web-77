
import { useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FlowCreateFormProps {
  onCreateFlow: (name: string, description: string) => Promise<any>;
  onComplete: () => void;
}

const FlowCreateForm = ({ onCreateFlow, onComplete }: FlowCreateFormProps) => {
  const [flowData, setFlowData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      if (!flowData.name.trim()) {
        toast.error("O nome do fluxo é obrigatório");
        return;
      }

      setIsSubmitting(true);
      const result = await onCreateFlow(flowData.name, flowData.description);
      
      if (result) {
        setFlowData({ name: "", description: "" });
        toast.success("Fluxo criado com sucesso!");
        onComplete();
      }
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      toast.error("Erro ao criar fluxo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="name">Nome do Fluxo</Label>
        <Input
          id="name"
          value={flowData.name}
          onChange={(e) => setFlowData({ ...flowData, name: e.target.value })}
          placeholder="Automação de Leads"
        />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={flowData.description}
          onChange={(e) => setFlowData({ ...flowData, description: e.target.value })}
          placeholder="Detalhe o propósito deste fluxo..."
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button 
          onClick={handleCreate} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando..." : "Criar Fluxo"}
        </Button>
      </div>
    </div>
  );
};

export default FlowCreateForm;
