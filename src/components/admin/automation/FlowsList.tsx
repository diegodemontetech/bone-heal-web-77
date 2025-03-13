
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useAutomationFlows } from "@/hooks/use-automation-flows";
import FlowsTable from "./flows/FlowsTable";
import NoFlowsMessage from "./flows/NoFlowsMessage";
import FlowCreateForm from "./flows/FlowCreateForm";
import { toast } from "sonner";

interface FlowsListProps {
  onFlowSelect?: (flowId: string) => void;
  onFlowCreate?: (flowId: string) => void;
}

const FlowsList = ({ onFlowSelect, onFlowCreate }: FlowsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    flows,
    isLoading,
    createFlow,
    toggleFlowStatus,
    duplicateFlow,
    deleteFlow,
  } = useAutomationFlows();

  const filteredFlows = flows.filter(
    (flow) =>
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (flow.description &&
        flow.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateFlow = async (
    name: string, 
    description: string,
    departmentId?: string,
    responsibleId?: string,
    hasAttachment?: boolean
  ) => {
    try {
      // Adicionando os novos campos à criação do fluxo
      const newFlow = await createFlow(
        name, 
        description, 
        {
          department_id: departmentId,
          responsible_id: responsibleId,
          has_attachment: hasAttachment || false
        }
      );
      
      if (newFlow) {
        setIsCreateDialogOpen(false);
        
        if (onFlowCreate) {
          onFlowCreate(newFlow.id);
        } else {
          navigate(`/admin/automation-flows/${newFlow.id}`);
        }
        
        return newFlow;
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      toast.error("Erro ao criar o pipeline de automação");
      return null;
    }
  };

  const handleEditFlow = (id: string) => {
    if (onFlowSelect) {
      onFlowSelect(id);
    } else {
      navigate(`/admin/automation-flows/${id}`);
    }
  };

  const executeFlow = async (id: string) => {
    try {
      const flow = flows.find(flow => flow.id === id);
      if (!flow) return;
      
      const response = await fetch(`/api/automation/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flowId: id }),
      });

      if (!response.ok) {
        throw new Error('Falha ao executar fluxo');
      }
      
      // Feedback ao usuário
      toast.success('Fluxo executado com sucesso!');
    } catch (error) {
      console.error('Erro ao executar fluxo:', error);
      toast.error('Erro ao executar fluxo');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Pipelines de Automação</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pipeline
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipelines Disponíveis</CardTitle>
          <div className="relative mt-2 w-full md:w-72">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pipelines..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <p className="mt-2 text-muted-foreground">Carregando pipelines...</p>
            </div>
          ) : filteredFlows.length > 0 ? (
            <FlowsTable
              flows={filteredFlows}
              onEdit={handleEditFlow}
              onDuplicate={duplicateFlow}
              onDelete={deleteFlow}
              onToggleStatus={toggleFlowStatus}
              onExecute={executeFlow}
            />
          ) : (
            <NoFlowsMessage
              onCreateNew={() => setIsCreateDialogOpen(true)}
              hasSearch={searchTerm.length > 0}
              onClearSearch={handleClearSearch}
            />
          )}
        </CardContent>
      </Card>

      <FlowCreateForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateFlow={handleCreateFlow}
        onComplete={() => {}}
      />
    </div>
  );
};

export default FlowsList;
