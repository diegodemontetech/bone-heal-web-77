
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Copy, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pipeline } from "@/types/crm";
import { usePipelineActions } from "./hooks/use-pipeline-actions";
import PipelineDialog from "./PipelineDialog";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CRMPipelinesPage = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline | null>(null);
  const { deletePipeline, duplicatePipeline, handleActivate, handleDeactivate } = usePipelineActions({
    pipelines,
    onPipelinesChange: setPipelines
  });

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_pipelines")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPipelines(data || []);
    } catch (err) {
      console.error("Erro ao buscar pipelines:", err);
      toast.error("Erro ao carregar pipelines");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pipeline?: Pipeline) => {
    setCurrentPipeline(pipeline || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentPipeline(null);
  };

  const handleSaveSuccess = () => {
    fetchPipelines();
    handleCloseDialog();
  };

  const handleDelete = async (pipeline: Pipeline) => {
    if (window.confirm(`Tem certeza que deseja excluir o pipeline "${pipeline.name}"?`)) {
      await deletePipeline(pipeline.id);
    }
  };

  const handleDuplicate = async (pipeline: Pipeline) => {
    await duplicatePipeline(pipeline);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pipelines do CRM</h1>
          <p className="text-muted-foreground">
            Gerencie os pipelines de leads para diferentes áreas do seu negócio
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Pipeline
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : pipelines.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">Nenhum pipeline criado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro pipeline para organizar seus leads
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Criar Pipeline
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelines.map((pipeline) => (
            <Card key={pipeline.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                  <Badge variant={pipeline.is_active ? "default" : "outline"}>
                    {pipeline.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                {pipeline.description && (
                  <p className="text-sm text-muted-foreground">{pipeline.description}</p>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Link do formulário:</span>
                    {pipeline.form_url ? (
                      <a 
                        href={pipeline.form_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate max-w-[150px]"
                      >
                        Ver formulário
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">Não configurado</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 pt-0 flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/crm/pipelines/${pipeline.id}/configurar`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(pipeline)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(pipeline)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Tabs defaultValue="kanban" className="w-auto">
                  <TabsList className="h-7">
                    <TabsTrigger value="kanban" className="px-2 py-1 h-6" asChild>
                      <Link to={`/admin/crm/pipelines/${pipeline.id}/kanban`}>Kanban</Link>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="px-2 py-1 h-6" asChild>
                      <Link to={`/admin/crm/pipelines/${pipeline.id}/lista`}>Lista</Link>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PipelineDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSaveSuccess}
        pipeline={currentPipeline}
      />
    </div>
  );
};

export default CRMPipelinesPage;
