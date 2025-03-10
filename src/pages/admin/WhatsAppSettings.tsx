
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Settings, QrCode, RefreshCw, Copy, Check } from 'lucide-react';

const AdminWhatsAppSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  
  const [evolutionUrl, setEvolutionUrl] = useState('');
  const [evolutionKey, setEvolutionKey] = useState('');
  const [zapiInstanceId, setZapiInstanceId] = useState('');
  const [zapiToken, setZapiToken] = useState('');
  
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
  
  const regenerateQRCode = async () => {
    setRegenerating(true);
    try {
      // Implemente a lógica para regenerar o QR code aqui
      toast.success('QR Code regenerado com sucesso');
    } catch (error) {
      console.error('Erro ao regenerar QR code:', error);
      toast.error('Erro ao regenerar QR code');
    } finally {
      setRegenerating(false);
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
                  
                  <Button onClick={saveSecrets} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                    Salvar Configurações
                  </Button>
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
                  
                  <div className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">QR Code de Conexão</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={regenerateQRCode}
                        disabled={regenerating}
                      >
                        {regenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Regenerar QR Code
                      </Button>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="bg-gray-100 p-4 rounded-lg inline-flex items-center justify-center">
                        <QrCode className="h-32 w-32 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Escaneie este QR Code com o WhatsApp para conectar sua instância
                    </p>
                  </div>
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
