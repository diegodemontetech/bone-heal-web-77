
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pipeline } from "@/types/crm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { StagesConfig } from "./config/StagesConfig";
import { FieldsConfig } from "./config/FieldsConfig";
import { FormConfig } from "./config/FormConfig";
import { PermissionsConfig } from "./config/PermissionsConfig";

const PipelineConfigPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stages");

  useEffect(() => {
    if (id) {
      fetchPipeline(id);
    }
  }, [id]);

  const fetchPipeline = async (pipelineId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_pipelines")
        .select("*")
        .eq("id", pipelineId)
        .single();

      if (error) throw error;
      if (!data) {
        toast.error("Pipeline não encontrado");
        navigate("/admin/crm/pipelines");
        return;
      }

      setPipeline(data);
    } catch (err) {
      console.error("Erro ao buscar pipeline:", err);
      toast.error("Erro ao carregar pipeline");
      navigate("/admin/crm/pipelines");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pipeline) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/crm/pipelines")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Configurar: {pipeline.name}</h1>
          <p className="text-muted-foreground">
            Configure estágios, campos e formulários para este pipeline
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="stages"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="stages">Estágios</TabsTrigger>
          <TabsTrigger value="fields">Campos</TabsTrigger>
          <TabsTrigger value="form">Formulário</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stages" className="space-y-4">
          <StagesConfig pipelineId={pipeline.id} />
        </TabsContent>
        
        <TabsContent value="fields" className="space-y-4">
          <FieldsConfig pipelineId={pipeline.id} />
        </TabsContent>
        
        <TabsContent value="form" className="space-y-4">
          <FormConfig pipelineId={pipeline.id} pipeline={pipeline} />
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4">
          <PermissionsConfig pipelineId={pipeline.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PipelineConfigPage;
