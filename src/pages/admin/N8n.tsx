
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const N8n = () => {
  const [testingWorkflow, setTestingWorkflow] = useState(false);

  const testN8nWorkflow = async () => {
    try {
      setTestingWorkflow(true);
      
      const { data, error } = await supabase.functions.invoke('trigger-workflow', {
        body: {
          workflow: "test_connection",
          data: {
            timestamp: new Date().toISOString(),
            source: "admin-panel"
          }
        }
      });

      if (error) throw new Error(error.message);
      
      toast.success("Workflow disparado com sucesso!");
      console.log("Resposta do workflow:", data);
    } catch (error) {
      console.error("Erro ao testar workflow:", error);
      toast.error("Erro ao testar conexão com n8n");
    } finally {
      setTestingWorkflow(false);
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Workflow className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">n8n Workflows</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automação com n8n</CardTitle>
            <CardDescription>
              Configure e gerencie workflows de automação usando n8n.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="rounded-md bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-amber-500" />
                    <div>
                      <h3 className="font-medium">Notificações de Pedidos</h3>
                      <p className="text-sm text-slate-500">
                        Envia notificações por WhatsApp e email quando um pedido é criado ou o pagamento é confirmado.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="font-medium">Processamento de Pagamentos</h3>
                      <p className="text-sm text-slate-500">
                        Processa pagamentos via MercadoPago e atualiza o status do pedido.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Sincronização com Omie</h3>
                      <p className="text-sm text-slate-500">
                        Envia pedidos confirmados para o Omie automaticamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={testN8nWorkflow} disabled={testingWorkflow}>
                {testingWorkflow ? "Testando..." : "Testar Conexão"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default N8n;
