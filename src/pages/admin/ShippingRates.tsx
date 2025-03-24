
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, FileUp, FileDown } from "lucide-react";
import Layout from "@/components/admin/Layout";
import { useShippingRates } from "@/hooks/admin/shipping/useShippingRates";
import { RatesTable } from "@/components/admin/shipping/RatesTable";
import { AddRateForm } from "@/components/admin/shipping/AddRateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ShippingRatesPage = () => {
  const [activeTab, setActiveTab] = useState("rates");
  const [isImporting, setIsImporting] = useState(false);
  const { shippingRates, isLoading, refetch } = useShippingRates();

  const handleImportStandardRates = async () => {
    if (window.confirm("Tem certeza que deseja importar as taxas padrão? Isso substituirá todas as taxas existentes.")) {
      setIsImporting(true);
      try {
        // Import standard rates from a service
        const { error } = await fetch("/api/shipping/import-standard-rates", {
          method: "POST",
        }).then(res => res.json());

        if (error) throw new Error(error);
        
        toast.success("Taxas de frete padrão importadas com sucesso!");
        refetch();
      } catch (error) {
        console.error("Erro ao importar taxas:", error);
        toast.error("Erro ao importar taxas de frete padrão");
      } finally {
        setIsImporting(false);
      }
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Taxas de Frete</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleImportStandardRates}
              disabled={isImporting}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Importar Tabela Padrão
            </Button>
            
            <Button onClick={() => setActiveTab("add")}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Taxa
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="rates">Taxas de Frete</TabsTrigger>
            <TabsTrigger value="add">Adicionar Nova Taxa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rates">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Taxas de Frete</CardTitle>
              </CardHeader>
              <CardContent>
                <RatesTable 
                  shippingRates={shippingRates} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Nova Taxa de Frete</CardTitle>
              </CardHeader>
              <CardContent>
                <AddRateForm onSuccess={() => {
                  setActiveTab("rates");
                  refetch();
                }} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ShippingRatesPage;
