
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testMercadoPagoConnection } from "@/services/payment-service";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Loader2, Key, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MercadoPagoCredentials {
  accessToken?: string;
  publicKey?: string;
  clientId?: string;
  clientSecret?: string;
}

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
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Estado para credenciais atuais
  const [currentCredentials, setCurrentCredentials] = useState<MercadoPagoCredentials & {
    fetched?: boolean;
  }>({});
  const [isFetchingCredentials, setIsFetchingCredentials] = useState(false);

  // Buscar credenciais quando o componente for montado
  useEffect(() => {
    fetchCurrentCredentials();
  }, []);

  // Função para buscar as credenciais atuais
  const fetchCurrentCredentials = async () => {
    setIsFetchingCredentials(true);
    try {
      const { data: settings, error } = await supabase
        .from('system_settings')
        .select('*')
        .in('key', ['MP_ACCESS_TOKEN', 'MP_PUBLIC_KEY', 'MP_CLIENT_ID', 'MP_CLIENT_SECRET']);
      
      if (error) {
        throw error;
      }
      
      const credentials: MercadoPagoCredentials = {};
      
      if (settings && settings.length > 0) {
        settings.forEach(setting => {
          if (setting.key === 'MP_ACCESS_TOKEN') {
            credentials.accessToken = setting.value.toString();
          }
          else if (setting.key === 'MP_PUBLIC_KEY') {
            credentials.publicKey = setting.value.toString();
          }
          else if (setting.key === 'MP_CLIENT_ID') {
            credentials.clientId = setting.value.toString();
          }
          else if (setting.key === 'MP_CLIENT_SECRET') {
            credentials.clientSecret = setting.value.toString();
          }
        });
      }
      
      setCurrentCredentials({
        accessToken: credentials.accessToken ? `${credentials.accessToken.substring(0, 10)}...` : "Não configurado",
        publicKey: credentials.publicKey ? `${credentials.publicKey.substring(0, 10)}...` : "Não configurado",
        clientId: credentials.clientId ? credentials.clientId : "Não configurado",
        clientSecret: credentials.clientSecret ? "••••••••••••••••" : "Não configurado",
        fetched: true
      });
      
    } catch (error) {
      console.error("Erro ao buscar credenciais:", error);
      toast.error("Erro ao buscar credenciais atuais");
    } finally {
      setIsFetchingCredentials(false);
    }
  };

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
        toast.error(`Falha no teste de conexão: ${result.message}`);
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
      if (accessToken.length < 20) {
        toast.error("O formato do Access Token parece inválido (muito curto)");
        return;
      }
      
      if (!publicKey.startsWith("APP_")) {
        toast.warning("A chave pública geralmente começa com 'APP_', verifique se está correta");
      }
      
      // Chamar função para atualizar as credenciais no Supabase
      const { data, error } = await supabase.functions.invoke('update-mp-credentials', {
        body: { 
          accessToken,
          publicKey,
          clientId: clientId || undefined,
          clientSecret: clientSecret || undefined
        }
      });
      
      if (error) {
        console.error("Erro ao atualizar credenciais:", error);
        toast.error("Erro ao atualizar credenciais do Mercado Pago");
        return;
      }
      
      toast.success("Credenciais do Mercado Pago atualizadas com sucesso!");
      
      // Atualizar credenciais exibidas
      await fetchCurrentCredentials();
      
      // Limpar campos
      setAccessToken("");
      setPublicKey("");
      setClientId("");
      setClientSecret("");
      
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
        <Tabs defaultValue="test">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="test">Testar Conexão</TabsTrigger>
            <TabsTrigger value="credentials">Atualizar Credenciais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test" className="space-y-4">
            {!currentCredentials.fetched ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando informações...</span>
              </div>
            ) : (
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium flex items-center mb-2">
                  <Info className="h-4 w-4 mr-2" />
                  Credenciais Configuradas
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Access Token:</p>
                    <p className="font-mono">{currentCredentials.accessToken}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Chave Pública:</p>
                    <p className="font-mono">{currentCredentials.publicKey}</p>
                  </div>
                  {currentCredentials.clientId && currentCredentials.clientId !== "Não configurado" && (
                    <div>
                      <p className="text-muted-foreground">Client ID:</p>
                      <p className="font-mono">{currentCredentials.clientId}</p>
                    </div>
                  )}
                  {currentCredentials.clientSecret && currentCredentials.clientSecret !== "Não configurado" && (
                    <div>
                      <p className="text-muted-foreground">Client Secret:</p>
                      <p className="font-mono">{currentCredentials.clientSecret}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button 
                onClick={handleTestConnection} 
                disabled={isLoading}
                size="lg"
                variant="default"
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
                    
                    {!testResult.success && testResult.data && testResult.data.message === 'invalid_token' && (
                      <Alert className="mt-3 bg-amber-50">
                        <AlertDescription>
                          O token de acesso foi rejeitado pelo Mercado Pago. Verifique se você está usando um token de produção válido e não um token de sandbox/teste.
                        </AlertDescription>
                      </Alert>
                    )}
                    
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
          </TabsContent>
          
          <TabsContent value="credentials" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Atualizar Credenciais do Mercado Pago
              </h3>
              
              <Alert className="bg-blue-50 mb-4">
                <AlertDescription>
                  Insira credenciais de <strong>produção</strong> do Mercado Pago para processar pagamentos reais. 
                  As credenciais podem ser obtidas no <a href="https://www.mercadopago.com.br/developers/panel" target="_blank" rel="noopener noreferrer" className="text-primary underline">Painel de Desenvolvedores do Mercado Pago</a>.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accessToken">Access Token (Produção)</Label>
                  <Input
                    id="accessToken"
                    type="text"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Token de acesso privado do Mercado Pago
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="publicKey">Chave Pública (Produção)</Label>
                  <Input
                    id="publicKey"
                    type="text"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="APP_USR-XXXX-XXXX-XXXX-XXXX"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Chave pública do Mercado Pago (geralmente começa com APP_USR)
                  </p>
                </div>

                <div>
                  <Label htmlFor="clientId">Client ID (opcional)</Label>
                  <Input
                    id="clientId"
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="123456789"
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="clientSecret">Client Secret (opcional)</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="font-mono"
                  />
                </div>
                
                <Button 
                  onClick={handleUpdateCredentials}
                  disabled={isUpdating || !accessToken || !publicKey}
                  className="w-full"
                  variant="default"
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
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />
        
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
