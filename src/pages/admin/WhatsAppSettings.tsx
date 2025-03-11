
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Settings, QrCode, RefreshCw, Copy, Check, Smartphone } from 'lucide-react';

const AdminWhatsAppSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  
  const [evolutionUrl, setEvolutionUrl] = useState('');
  const [evolutionKey, setEvolutionKey] = useState('');
  const [zapiInstanceId, setZapiInstanceId] = useState('');
  const [zapiToken, setZapiToken] = useState('');
  const [instanceName, setInstanceName] = useState('default');
  
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    const webhookBaseUrl = window.location.origin.includes('localhost') 
      ? 'http://localhost:54321/functions/v1'
      : `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;
    
    setWebhookUrl(`${webhookBaseUrl}/webhook-whatsapp`);
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: { getConfig: true }
      });
      
      if (error) throw error;
      
      if (data?.config) {
        setEvolutionUrl(data.config.evolutionApiUrl || '');
        setEvolutionKey(data.config.evolutionApiKey || '');
        setZapiInstanceId(data.config.zApiInstanceId || '');
        setZapiToken(data.config.zApiToken || '');
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };
  
  const saveSecrets = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-secret', {
        body: { 
          secrets: {
            'EVOLUTION_API_URL': evolutionUrl,
            'EVOLUTION_API_KEY': evolutionKey,
            'ZAPI_INSTANCE_ID': zapiInstanceId,
            'ZAPI_TOKEN': zapiToken
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const createInstance = async () => {
    setQrCodeLoading(true);
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return;
      }

      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getInstance',
          instanceName: instanceName
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Instância criada com sucesso. Gere o QR Code para conectar.');
      } else {
        toast.error(data?.message || 'Erro ao criar instância');
      }
    } catch (error: any) {
      console.error('Erro ao criar instância:', error);
      toast.error('Erro ao criar instância: ' + error.message);
    } finally {
      setQrCodeLoading(false);
    }
  };
  
  const generateQRCode = async () => {
    setQrCodeLoading(true);
    setQrCodeData('');
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return;
      }

      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getQRCode',
          instanceName: instanceName
        }
      });
      
      if (error) throw error;
      
      if (data?.success && data?.qrcode) {
        setQrCodeData(data.qrcode);
      } else {
        toast.error(data?.message || 'Erro ao gerar QR Code');
      }
    } catch (error: any) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code: ' + error.message);
    } finally {
      setQrCodeLoading(false);
    }
  };
  
  const checkConnectionStatus = async () => {
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return;
      }

      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getConnectionStatus',
          instanceName: instanceName
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success(`Status da conexão: ${data.status}`);
      } else {
        toast.error(data?.message || 'Erro ao verificar status');
      }
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      toast.error('Erro ao verificar status: ' + error.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações WhatsApp</h1>
          <p className="text-muted-foreground">Configure a integração com o WhatsApp</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          <Tabs defaultValue="evolution">
            <TabsList className="mb-6">
              <TabsTrigger value="evolution">Evolution API</TabsTrigger>
              <TabsTrigger value="zapi">Z-API</TabsTrigger>
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
              <TabsTrigger value="qrcode">QR Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evolution">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração da Evolution API</CardTitle>
                  <CardDescription>
                    Configure os dados de acesso à Evolution API para WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="evolution-url">URL da API</Label>
                    <Input
                      id="evolution-url"
                      placeholder="https://seu-servidor.com"
                      value={evolutionUrl}
                      onChange={(e) => setEvolutionUrl(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      URL da API Evolution sem a barra no final
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="evolution-key">Chave da API</Label>
                    <Input
                      id="evolution-key"
                      type="password"
                      placeholder="Chave de acesso"
                      value={evolutionKey}
                      onChange={(e) => setEvolutionKey(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instance-name">Nome da Instância</Label>
                    <Input
                      id="instance-name"
                      placeholder="default"
                      value={instanceName}
                      onChange={(e) => setInstanceName(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Nome da instância para identificar diferentes conexões
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={saveSecrets} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                      Salvar Configurações
                    </Button>
                    
                    <Button variant="outline" onClick={createInstance} disabled={qrCodeLoading}>
                      {qrCodeLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Smartphone className="h-4 w-4 mr-2" />}
                      Criar Instância
                    </Button>
                    
                    <Button variant="secondary" onClick={checkConnectionStatus}>
                      Verificar Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="zapi">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração da Z-API</CardTitle>
                  <CardDescription>
                    Configure os dados de acesso à Z-API para WhatsApp (alternativa)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zapi-instance">ID da Instância</Label>
                    <Input
                      id="zapi-instance"
                      placeholder="ID da instância Z-API"
                      value={zapiInstanceId}
                      onChange={(e) => setZapiInstanceId(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zapi-token">Token de Acesso</Label>
                    <Input
                      id="zapi-token"
                      type="password"
                      placeholder="Token de acesso Z-API"
                      value={zapiToken}
                      onChange={(e) => setZapiToken(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={saveSecrets} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="webhook">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração de Webhook</CardTitle>
                  <CardDescription>
                    Configure o URL de webhook na sua instância do WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL do Webhook</Label>
                    <div className="flex">
                      <Input
                        id="webhook-url"
                        value={webhookUrl}
                        readOnly
                        className="rounded-r-none"
                      />
                      <Button 
                        variant="outline" 
                        className="rounded-l-none border-l-0"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use este URL para configurar o webhook na sua instância do WhatsApp
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qrcode">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code de Conexão</CardTitle>
                  <CardDescription>
                    Gere o QR Code para conectar o WhatsApp com sua instância
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={generateQRCode}
                      disabled={qrCodeLoading}
                      className="mb-6"
                    >
                      {qrCodeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      {qrCodeData ? 'Regenerar QR Code' : 'Gerar QR Code'}
                    </Button>
                  </div>
                  
                  <div className="flex justify-center">
                    {qrCodeLoading ? (
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <Loader2 className="h-32 w-32 animate-spin text-primary" />
                      </div>
                    ) : qrCodeData ? (
                      <div className="bg-white p-4 rounded-lg">
                        <img 
                          src={qrCodeData} 
                          alt="QR Code para WhatsApp" 
                          className="w-64 h-64"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-4 rounded-lg inline-flex items-center justify-center">
                        <QrCode className="h-32 w-32 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Escaneie este QR Code com o WhatsApp para conectar sua instância
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdminWhatsAppSettings;
