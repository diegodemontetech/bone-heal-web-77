
import { useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FlowCreateFormProps {
  onCreateFlow: (name: string, description: string) => Promise<any>;
  onComplete: () => void;
}

const FlowCreateForm = ({ onCreateFlow, onComplete }: FlowCreateFormProps) => {
  const [flowData, setFlowData] = useState({ name: "", description: "" });

  const handleCreate = async () => {
    const result = await onCreateFlow(flowData.name, flowData.description);
    if (result) {
      setFlowData({ name: "", description: "" });
      onComplete();
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
        <Button onClick={handleCreate}>Criar Fluxo</Button>
      </div>
    </div>
  );
};

export default FlowCreateForm;
