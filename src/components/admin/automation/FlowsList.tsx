
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAutomationFlows } from "@/hooks/use-automation-flows";
import FlowCreateForm from "./flows/FlowCreateForm";
import NoFlowsMessage from "./flows/NoFlowsMessage";
import FlowsTable from "./flows/FlowsTable";

interface FlowsListProps {
  onSelectFlow: (flowId: string) => void;
}

const FlowsList = ({ onSelectFlow }: FlowsListProps) => {
  const [newFlowOpen, setNewFlowOpen] = useState(false);
  const {
    flows,
    loading,
    createFlow,
    deleteFlow,
    duplicateFlow,
    toggleFlowStatus
  } = useAutomationFlows();

  const handleCreateFlow = async (name: string, description: string) => {
    try {
      const newFlow = await createFlow(name, description);
      if (newFlow) {
        setNewFlowOpen(false);
        onSelectFlow(newFlow.id);
        return newFlow;
      }
      return null;
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      throw error; // Permite que o FlowCreateForm trate o erro
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Seus Fluxos de Automação</h2>
        <Dialog open={newFlowOpen} onOpenChange={setNewFlowOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Fluxo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Fluxo de Trabalho</DialogTitle>
            </DialogHeader>
            <FlowCreateForm 
              onCreateFlow={handleCreateFlow}
              onComplete={() => setNewFlowOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando fluxos...</div>
      ) : flows.length === 0 ? (
        <NoFlowsMessage onCreateNew={() => setNewFlowOpen(true)} />
      ) : (
        <FlowsTable
          flows={flows}
          onSelectFlow={onSelectFlow}
          onToggleStatus={toggleFlowStatus}
          onDuplicate={duplicateFlow}
          onDelete={deleteFlow}
        />
      )}
    </div>
  );
};

export default FlowsList;
