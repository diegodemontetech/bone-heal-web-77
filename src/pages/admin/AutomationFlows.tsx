
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FlowBuilder from "@/components/admin/automation/FlowBuilder";
import FlowsList from "@/components/admin/automation/FlowsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActionsPalette from "@/components/admin/automation/ActionsPalette";

const AutomationFlows = () => {
  const [activeTab, setActiveTab] = useState("flows");
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Automação de Fluxos de Trabalho</h1>
      
      <Tabs defaultValue="flows" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="flows">Meus Fluxos</TabsTrigger>
          <TabsTrigger value="builder">Construtor de Fluxos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flows">
          <Card>
            <CardHeader>
              <CardTitle>Fluxos de Trabalho</CardTitle>
              <CardDescription>
                Visualize e gerencie seus fluxos de automação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlowsList onSelectFlow={(flowId) => {
                setSelectedFlow(flowId);
                setActiveTab("builder");
              }} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="builder" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <ActionsPalette />
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Construtor de Fluxos</CardTitle>
                  <CardDescription>
                    Arraste e conecte os nós para criar seu fluxo de trabalho
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <FlowBuilder flowId={selectedFlow} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationFlows;
