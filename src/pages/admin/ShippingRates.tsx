
import { useEffect, useState } from "react";
import ShippingRatesTable from "@/components/admin/shipping/ShippingRatesTable";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const AdminShippingRates = () => {
  const [connectionStatus, setConnectionStatus] = useState<{status: string, message: string, count?: number}>({
    status: 'checking',
    message: 'Verificando conexão com o banco de dados...'
  });
  
  useEffect(() => {
    console.log("Renderizando página de taxas de frete");
    
    // Verificar a conexão com o Supabase
    const checkConnection = async () => {
      try {
        setConnectionStatus({
          status: 'checking',
          message: 'Verificando conexão com o banco de dados...'
        });
        
        // Verificar se a tabela existe
        const { data, error, count } = await supabase
          .from('shipping_rates')
          .select('*', { count: 'exact' })
          .limit(1);
        
        if (error) {
          console.error("Erro ao verificar conexão com tabela shipping_rates:", error);
          console.error("Detalhes:", error.message, error.code, error.details);
          
          setConnectionStatus({
            status: 'error',
            message: `Erro na conexão: ${error.message} (código: ${error.code})`
          });
          
          return;
        }
        
        console.log(`Conexão com Supabase verificada com sucesso. Contagem de taxas: ${count}`);
        
        setConnectionStatus({
          status: 'success',
          message: 'Conexão com banco de dados estabelecida com sucesso',
          count: count || 0
        });
      } catch (err: any) {
        console.error("Falha ao testar conexão com Supabase:", err);
        
        setConnectionStatus({
          status: 'error',
          message: `Falha na conexão: ${err.message || 'Erro desconhecido'}`
        });
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Fretes</h1>
      
      {connectionStatus.status === 'error' && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Problema de conexão</AlertTitle>
          <AlertDescription>{connectionStatus.message}</AlertDescription>
        </Alert>
      )}
      
      {connectionStatus.status === 'success' && connectionStatus.count === 0 && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Tabela de fretes vazia</AlertTitle>
          <AlertDescription>Não existem taxas de frete cadastradas. Use o botão "Importar Tabela Padrão" para adicionar taxas pré-configuradas.</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4 text-sm text-muted-foreground">
        Configure as taxas de frete por estado e tipo de serviço. Os valores serão utilizados para cálculo automático no checkout.
      </div>
      
      <ShippingRatesTable />
    </div>
  );
};

export default AdminShippingRates;
