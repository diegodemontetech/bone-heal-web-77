
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Plus, Play, Trash2, Edit, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Flow {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface FlowsListProps {
  onSelectFlow: (flowId: string) => void;
}

const FlowsList = ({ onSelectFlow }: FlowsListProps) => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFlowOpen, setNewFlowOpen] = useState(false);
  const [newFlow, setNewFlow] = useState({ name: "", description: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("automation_flows")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setFlows(data || []);
    } catch (error) {
      console.error("Erro ao buscar fluxos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fluxos de trabalho",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFlow = async () => {
    try {
      if (!newFlow.name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "Nome do fluxo é obrigatório",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("automation_flows")
        .insert({
          name: newFlow.name,
          description: newFlow.description,
          nodes: [],
          edges: [],
          is_active: false,
        })
        .select("*")
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fluxo de trabalho criado com sucesso",
      });

      setFlows([data, ...flows]);
      setNewFlowOpen(false);
      setNewFlow({ name: "", description: "" });
      onSelectFlow(data.id);
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o fluxo de trabalho",
        variant: "destructive",
      });
    }
  };

  const deleteFlow = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este fluxo de trabalho?")) return;

    try {
      const { error } = await supabase
        .from("automation_flows")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fluxo de trabalho excluído com sucesso",
      });

      setFlows(flows.filter(flow => flow.id !== id));
    } catch (error) {
      console.error("Erro ao excluir fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o fluxo de trabalho",
        variant: "destructive",
      });
    }
  };

  const duplicateFlow = async (flowToDuplicate: Flow) => {
    try {
      // Fetch the flow data first
      const { data: flowData, error: fetchError } = await supabase
        .from("automation_flows")
        .select("*")
        .eq("id", flowToDuplicate.id)
        .single();

      if (fetchError) throw fetchError;

      // Insert a new flow with the same data
      const { data: newFlowData, error: insertError } = await supabase
        .from("automation_flows")
        .insert({
          name: `${flowToDuplicate.name} (Cópia)`,
          description: flowToDuplicate.description,
          nodes: flowData.nodes,
          edges: flowData.edges,
          is_active: false,
        })
        .select("*")
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Sucesso",
        description: "Fluxo de trabalho duplicado com sucesso",
      });

      setFlows([newFlowData, ...flows]);
    } catch (error) {
      console.error("Erro ao duplicar fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o fluxo de trabalho",
        variant: "destructive",
      });
    }
  };

  const toggleFlowStatus = async (flow: Flow) => {
    try {
      const { error } = await supabase
        .from("automation_flows")
        .update({ is_active: !flow.is_active })
        .eq("id", flow.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Fluxo ${flow.is_active ? "desativado" : "ativado"} com sucesso`,
      });

      setFlows(
        flows.map(f => 
          f.id === flow.id ? { ...f, is_active: !f.is_active } : f
        )
      );
    } catch (error) {
      console.error("Erro ao alterar status do fluxo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do fluxo",
        variant: "destructive",
      });
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
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nome do Fluxo</Label>
                <Input
                  id="name"
                  value={newFlow.name}
                  onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })}
                  placeholder="Automação de Leads"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newFlow.description}
                  onChange={(e) => setNewFlow({ ...newFlow, description: e.target.value })}
                  placeholder="Detalhe o propósito deste fluxo..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={createFlow}>Criar Fluxo</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando fluxos...</div>
      ) : flows.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground mb-4">Nenhum fluxo de trabalho encontrado</p>
          <Button onClick={() => setNewFlowOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Fluxo
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flows.map((flow) => (
              <TableRow key={flow.id}>
                <TableCell className="font-medium">{flow.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">{flow.description}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${flow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {flow.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(flow.updated_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectFlow(flow.id)}
                      title="Editar fluxo"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleFlowStatus(flow)}
                      title={flow.is_active ? "Desativar fluxo" : "Ativar fluxo"}
                    >
                      <Play className={`h-4 w-4 ${flow.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => duplicateFlow(flow)}
                      title="Duplicar fluxo"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFlow(flow.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Excluir fluxo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default FlowsList;
