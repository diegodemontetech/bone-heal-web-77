
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OmieCustomersSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleSyncClientes = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-omie-users');
      
      if (error) {
        console.error("Erro na sincronização:", error);
        toast.error("Erro ao sincronizar clientes com Omie");
        return;
      }
      
      console.log("Resultado da sincronização:", data);
      setLastResult(data);
      
      toast.success(data.message || "Sincronização concluída!");
    } catch (err) {
      console.error("Erro ao chamar função:", err);
      toast.error("Erro ao processar sincronização");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sincronização de Usuários do Omie</CardTitle>
        <CardDescription>
          Criar usuários no sistema para clientes que já realizaram pedidos no Omie
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleSyncClientes} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Criar Usuários de Clientes com Pedidos
              </>
            )}
          </Button>
          
          {lastResult && (
            <div className="mt-4 p-4 border rounded bg-muted">
              <h3 className="font-medium">Último resultado:</h3>
              <p className="text-sm mt-2">
                Usuários criados: <span className="font-semibold">{lastResult.stats?.created || 0}</span>
              </p>
              <p className="text-sm">
                Usuários pulados: <span className="font-semibold">{lastResult.stats?.skipped || 0}</span>
              </p>
              <p className="text-sm">
                Erros: <span className="font-semibold">{lastResult.stats?.errors || 0}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OmieCustomersSync;
