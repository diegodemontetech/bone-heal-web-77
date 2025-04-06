
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testMercadoPagoConnection } from "@/services/payment-service";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Loader2, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const TestMercadoPago = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    data?: any;
    timestamp?: string;
  } | null>(null);
  
  // Estado para novas credenciais
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testMercadoPagoConnection();
      setTestResult({
        ...result,
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        toast.success("Conexão com Mercado Pago testada com sucesso!");
      } else {
        toast.error("Falha no teste de conexão com Mercado Pago");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      setTestResult({
        success: false,
        message: `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        timestamp: new Date().toISOString()
      });
      toast.error("Erro ao testar conexão com Mercado Pago");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCredentials = async () => {
    if (!accessToken || !publicKey) {
      toast.error("Preencha ambos os campos de token e chave pública");
      return;
    }
    
    setIsUpdating(true);
    try {
      // Verificar formatos básicos
      if (!accessToken.includes("-")) {
        toast.error("O formato do Access Token parece inválido");
        return;
      }
      
      if (!publicKey.startsWith("APP_")) {
        toast.warning("A chave pública geralmente começa com 'APP_', verifique se está correta");
      }
      
      // Chamar função para atualizar as credenciais no Supabase
      const { data, error } = await supabase.functions.invoke('update-mp-credentials', {
        body: { 
          accessToken,
          publicKey
        }
      });
      
      if (error) {
        console.error("Erro ao atualizar credenciais:", error);
        toast.error("Erro ao atualizar credenciais do Mercado Pago");
        return;
      }
      
      toast.success("Credenciais do Mercado Pago atualizadas com sucesso!");
      
      // Limpar campos
      setAccessToken("");
      setPublicKey("");
      
      // Testar a nova conexão automaticamente
      handleTestConnection();
      
    } catch (error) {
      console.error("Error updating credentials:", error);
      toast.error("Erro ao atualizar credenciais");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Teste de Conexão com Mercado Pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button 
            onClick={handleTestConnection} 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar Conexão com Mercado Pago'
            )}
          </Button>
        </div>
        
        {testResult && (
          <div className={`mt-6 p-4 rounded-lg border ${
            testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.success ? 'Sucesso!' : 'Falha!'}
                </h4>
                <p className="text-sm mt-1">
                  {testResult.message}
                </p>
                
                {testResult.data && (
                  <div className="mt-4 bg-white bg-opacity-60 p-3 rounded border border-gray-200 overflow-auto max-h-48">
                    <pre className="text-xs whitespace-pre-wrap break-words">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Teste realizado em: {new Date(testResult.timestamp || '').toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-6" />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Atualizar Credenciais do Mercado Pago
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                id="accessToken"
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="ACCESS-TOKEN-XXXX-XXXX-XXXX"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Token de acesso privado do Mercado Pago
              </p>
            </div>
            
            <div>
              <Label htmlFor="publicKey">Chave Pública</Label>
              <Input
                id="publicKey"
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="APP_USR-XXXX-XXXX-XXXX"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Chave pública do Mercado Pago (geralmente começa com APP_USR)
              </p>
            </div>
            
            <Button 
              onClick={handleUpdateCredentials}
              disabled={isUpdating || !accessToken || !publicKey}
              className="w-full"
              variant="outline"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Credenciais'
              )}
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          <p>
            Este teste verifica se as credenciais do Mercado Pago estão configuradas corretamente, 
            tentando obter os métodos de pagamento disponíveis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestMercadoPago;
