
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentForm } from "./DepartmentForm";
import { FieldsForm } from "./FieldsForm";
import { KanbanStagesForm } from "./KanbanStagesForm";
import { AutomationForm } from "./AutomationForm";

export function CRMConfigTabs() {
  const [activeTab, setActiveTab] = useState("departments");

  return (
    <Tabs
      defaultValue="departments"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full mb-8">
        <TabsTrigger value="departments">Departamentos</TabsTrigger>
        <TabsTrigger value="fields">Campos</TabsTrigger>
        <TabsTrigger value="stages">Estágios Kanban</TabsTrigger>
        <TabsTrigger value="automations">Automações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="departments" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Departamentos do CRM</h2>
        <p className="text-muted-foreground mb-6">
          Configure os departamentos que usarão o CRM. Cada departamento pode ter seus próprios estágios e fluxos de trabalho.
        </p>
        <DepartmentForm onSuccess={() => {}} />
      </TabsContent>
      
      <TabsContent value="fields" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Campos Personalizados</h2>
        <p className="text-muted-foreground mb-6">
          Configure campos personalizados para os leads no CRM. Você pode definir diferentes tipos de campos e quais serão exibidos no Kanban.
        </p>
        <FieldsForm onSuccess={() => {}} />
      </TabsContent>
      
      <TabsContent value="stages" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Estágios do Kanban</h2>
        <p className="text-muted-foreground mb-6">
          Configure os estágios do Kanban para cada departamento. Defina cores e a ordem dos estágios para melhor visualização.
        </p>
        <KanbanStagesForm onSuccess={() => {}} />
      </TabsContent>
      
      <TabsContent value="automations" className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Automações</h2>
        <p className="text-muted-foreground mb-6">
          Configure automações para executar ações quando leads mudam de estágio ou permanecem em um estágio por um determinado tempo.
        </p>
        <AutomationForm onSuccess={() => {}} />
      </TabsContent>
    </Tabs>
  );
}
