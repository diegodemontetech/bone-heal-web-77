
import { useState } from "react";
import CRMKanban from "@/components/admin/crm/CRMKanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PipelineSelector } from "@/components/admin/crm/PipelineSelector";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Users } from "lucide-react";

const LeadsCRMPage = () => {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            CRM Boneheal
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie leads, contatos e oportunidades em diversos pipelines
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <PipelineSelector 
            selectedPipeline={selectedPipeline} 
            onPipelineChange={setSelectedPipeline} 
          />
          
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kanban" className="w-full">
          <CRMKanban 
            pipelineId={selectedPipeline} 
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <div className="bg-muted/50 border rounded-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Visualização em Lista</h3>
            <p className="text-muted-foreground">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics">
          <div className="bg-muted/50 border rounded-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Métricas e Relatórios</h3>
            <p className="text-muted-foreground">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadsCRMPage;
