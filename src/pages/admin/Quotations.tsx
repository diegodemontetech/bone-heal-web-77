
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import QuotationsList from "@/components/admin/quotations/QuotationsList";
import CreateQuotation from "@/components/admin/quotations/CreateQuotation";

const Quotations = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [isCreating, setIsCreating] = useState(false);

  const handleNewQuotation = () => {
    setIsCreating(true);
    setActiveTab("new");
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setActiveTab("list");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        {!isCreating && (
          <Button onClick={handleNewQuotation}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list" disabled={isCreating}>
            <List className="h-4 w-4 mr-2" />
            Lista de Orçamentos
          </TabsTrigger>
          {isCreating && (
            <TabsTrigger value="new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orçamentos</CardTitle>
              <CardDescription>
                Veja todos os orçamentos criados pela equipe de inside sales.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuotationsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Novo Orçamento</CardTitle>
              <CardDescription>
                Crie um novo orçamento para um cliente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateQuotation onCancel={handleCancelCreate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Quotations;
