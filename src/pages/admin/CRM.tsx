
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Layout from '@/components/admin/Layout';

const CRMPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "CRM | Gestão de Clientes";
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">CRM - Gestão de Clientes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
              <CardTitle className="text-indigo-700 dark:text-indigo-300">Hunting Ativo</CardTitle>
              <CardDescription>Aquisição de Novos Clientes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Gerencie leads desde o primeiro contato até a conversão em cliente.
                Acompanhe todo o processo de aquisição com um pipeline completo.
              </p>
              <Button 
                onClick={() => navigate('/admin/crm/hunting')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Acessar Pipeline
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="bg-sky-50 dark:bg-sky-900/20">
              <CardTitle className="text-sky-700 dark:text-sky-300">Carteira de Clientes</CardTitle>
              <CardDescription>Gestão de Clientes Existentes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Mantenha relacionamento com clientes após a primeira compra, 
                incentivando a recompra e fidelização.
              </p>
              <Button 
                onClick={() => navigate('/admin/crm/carteira')}
                className="bg-sky-600 hover:bg-sky-700"
              >
                Acessar Pipeline
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Visão geral do desempenho dos seus pipelines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Em breve você poderá visualizar estatísticas detalhadas sobre seus pipelines, 
              incluindo taxas de conversão, tempo médio em cada fase, e muito mais.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CRMPage;
