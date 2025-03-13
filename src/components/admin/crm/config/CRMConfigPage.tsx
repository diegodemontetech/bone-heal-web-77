
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepartmentConfig from "./DepartmentConfig";
import FieldsConfig from "./FieldsConfig";
import KanbanConfig from "./KanbanConfig";
import AutomationConfig from "./AutomationConfig";

const CRMConfigPage = () => {
  const [activeTab, setActiveTab] = useState("departamentos");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações do CRM</h1>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="departamentos">Departamentos</TabsTrigger>
            <TabsTrigger value="campos">Campos</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="automacao">Automação</TabsTrigger>
          </TabsList>

          <TabsContent value="departamentos">
            <DepartmentConfig />
          </TabsContent>

          <TabsContent value="campos">
            <FieldsConfig />
          </TabsContent>

          <TabsContent value="kanban">
            <KanbanConfig />
          </TabsContent>

          <TabsContent value="automacao">
            <AutomationConfig />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CRMConfigPage;
