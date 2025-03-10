
import { useEffect, useState } from "react";
import ShippingRatesTable from "@/components/admin/shipping/ShippingRatesTable";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ShieldAlert } from "lucide-react";
import { useAuthContext } from "@/hooks/auth/auth-context";

const AdminShippingRates = () => {
  const { session, isAdmin } = useAuthContext();
  const [connectionStatus, setConnectionStatus] = useState<{status: string, message: string, count?: number}>({
    status: 'checking',
    message: 'Verificando conexão com o banco de dados...'
  });
  
  useEffect(() => {
    console.log("Renderizando página de taxas de frete");
    console.log("Status de autenticação:", session ? "Autenticado" : "Não autenticado");
    console.log("É administrador:", isAdmin);
    
    // Verificar a conexão com o Supabase
    const checkConnection = async () => {
      try {
        setConnectionStatus({
          status: 'checking',
          message: 'Verificando conexão com o banco de dados...'
        });
        
        // Verificar versão primeiro
        const { data: versionData, error: versionError } = await supabase.rpc('version');
        
        if (versionError) {
          console.error("Erro ao verificar versão:", versionError);
          setConnectionStatus({
            status: 'error',
            message: `Falha na verificação de versão: ${versionError.message}`
          });
          return;
        }
        
        console.log("Versão do banco:", versionData);
        
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
    
    if (session) {
      checkConnection();
    }
  }, [session, isAdmin]);
  
  if (!session) {
    return (
      <div className="p-8">
        <Alert variant="destructive" className="mb-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso não autorizado</AlertTitle>
          <AlertDescription>Você precisa estar autenticado para acessar esta página.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="p-8">
        <Alert variant="destructive" className="mb-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Permissão negada</AlertTitle>
          <AlertDescription>Apenas administradores podem acessar o gerenciamento de fretes.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
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
