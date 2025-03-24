
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadsKanban from "@/pages/admin/LeadsKanban";

interface CRMKanbanProps {
  defaultPipelineId?: string;
}

const CRMKanban = ({ defaultPipelineId }: CRMKanbanProps) => {
  const [activeTab, setActiveTab] = useState("leads");

  useEffect(() => {
    console.log("CRM Kanban mounted with pipeline ID:", defaultPipelineId);
  }, [defaultPipelineId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban de Leads</h1>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="customers">Clientes</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <TabsContent value="leads" className="mt-0">
            <LeadsKanban pipelineId={defaultPipelineId} />
          </TabsContent>
          
          <TabsContent value="customers" className="mt-0">
            <div className="p-6">
              <p className="text-muted-foreground">Kanban de clientes em breve.</p>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMKanban;
