
import { OmieCustomersSync } from '@/components/admin/OmieCustomersSync';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestOmieSync from '@/components/TestOmieSync';
import { ArrowRightIcon, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleOmieCustomersSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-omie-customers');
      
      if (error) {
        throw error;
      }
      
      toast.success(`Sincronização iniciada: ${data.message}`);
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
      toast.error('Falha ao iniciar sincronização com o Omie');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sincronização</h1>

      <Tabs defaultValue="customers">
        <TabsList className="mb-4">
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sincronização de Clientes</CardTitle>
                <CardDescription>
                  Sincronize os clientes do Omie com o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Esta função irá buscar os clientes cadastrados no Omie e sincronizá-los com o banco de dados.
                  O processo é executado em lotes para evitar sobrecarga.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleOmieCustomersSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Iniciar Sincronização
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <OmieCustomersSync />
          </div>

          <TestOmieSync />
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Sincronização de Produtos</CardTitle>
              <CardDescription>
                Sincronize os produtos do Omie com o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta função irá buscar os produtos cadastrados no Omie e sincronizá-los com o banco de dados.
                A sincronização inclui preços, estoque e informações cadastrais.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Iniciar Sincronização
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Sincronização de Pedidos</CardTitle>
              <CardDescription>
                Sincronize os pedidos entre o sistema e o Omie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta função permite sincronizar os pedidos realizados no sistema com o Omie,
                bem como atualizar o status dos pedidos já sincronizados.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Iniciar Sincronização
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SyncPage;
