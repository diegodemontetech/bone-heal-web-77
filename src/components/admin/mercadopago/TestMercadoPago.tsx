
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { testMercadoPagoConnection } from '@/services/payment-service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type CredentialType = {
  accessToken: string;
  publicKey: string;
  clientId?: string;
  clientSecret?: string;
};

type TestStatus = 'idle' | 'loading' | 'success' | 'error';

const TestMercadoPago = () => {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [credentials, setCredentials] = useState<CredentialType>({
    accessToken: '',
    publicKey: '',
    clientId: '',
    clientSecret: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar credenciais atuais
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('system_settings')
          .select('*')
          .in('key', ['MP_ACCESS_TOKEN', 'MP_PUBLIC_KEY', 'MP_CLIENT_ID', 'MP_CLIENT_SECRET']);

        if (error) {
          console.error('Erro ao carregar credenciais:', error);
          toast.error('Não foi possível carregar as credenciais do banco de dados');
          return;
        }

        if (data && data.length > 0) {
          const newCredentials = { ...credentials };

          data.forEach((setting: any) => {
            if (setting.key === 'MP_ACCESS_TOKEN') {
              newCredentials.accessToken = setting.value;
            } else if (setting.key === 'MP_PUBLIC_KEY') {
              newCredentials.publicKey = setting.value;
            } else if (setting.key === 'MP_CLIENT_ID') {
              newCredentials.clientId = setting.value;
            } else if (setting.key === 'MP_CLIENT_SECRET') {
              newCredentials.clientSecret = setting.value;
            }
          });

          setCredentials(newCredentials);
        }
      } catch (err) {
        console.error('Erro ao processar credenciais:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleTestConnection = async () => {
    setStatus('loading');
    setMessage('Testando conexão com o Mercado Pago...');

    try {
      const result = await testMercadoPagoConnection();
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Falha ao testar conexão: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const saveCredentials = async () => {
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase.functions.invoke('update-mp-credentials', {
        body: credentials
      });

      if (error) {
        toast.error(`Erro ao salvar credenciais: ${error.message}`);
        return;
      }

      if (data.success) {
        toast.success('Credenciais salvas com sucesso!');
        // Reset status após salvar
        setStatus('idle');
      } else {
        toast.error(`Erro: ${data.message}`);
      }
    } catch (err) {
      console.error('Erro ao salvar credenciais:', err);
      toast.error('Ocorreu um erro ao salvar as credenciais');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Mercado Pago - Teste de Conexão</CardTitle>
        <CardDescription>
          Configure e teste suas credenciais do Mercado Pago
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  name="accessToken"
                  value={credentials.accessToken}
                  onChange={handleInputChange}
                  placeholder="APP_USR-0000000000000-000000-00000000000000000000000000000000-000000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicKey">Public Key</Label>
                <Input
                  id="publicKey"
                  name="publicKey"
                  value={credentials.publicKey}
                  onChange={handleInputChange}
                  placeholder="APP_USR-00000000-0000-0000-0000-000000000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID (opcional)</Label>
                <Input
                  id="clientId"
                  name="clientId"
                  value={credentials.clientId || ''}
                  onChange={handleInputChange}
                  placeholder="000000000000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret (opcional)</Label>
                <Input
                  id="clientSecret"
                  name="clientSecret"
                  type="password"
                  value={credentials.clientSecret || ''}
                  onChange={handleInputChange}
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                onClick={saveCredentials}
                disabled={isSaving}
                className="bg-primary text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Credenciais'
                )}
              </Button>

              <Button
                onClick={handleTestConnection}
                disabled={status === 'loading'}
                variant="outline"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar Conexão'
                )}
              </Button>
            </div>
          </>
        )}

        {status === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Conexão realizada com sucesso</AlertTitle>
            <AlertDescription className="text-green-700">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Erro de conexão</AlertTitle>
            <AlertDescription className="text-red-700">
              {message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t p-4 text-sm text-gray-600">
        <p>
          Use as credenciais de produção do Mercado Pago para processar pagamentos reais.
        </p>
        <p className="mt-2">
          Para obter suas credenciais, acesse sua{" "}
          <a
            href="https://www.mercadopago.com.br/settings/account/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            conta do Mercado Pago
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default TestMercadoPago;
