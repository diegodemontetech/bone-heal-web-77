
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Download, Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";

const WhatsAppSettings = () => {
  const { profile } = useAuth();
  const [evolutionWebhookUrl, setEvolutionWebhookUrl] = useState("");
  const [evolutionApiUrl, setEvolutionApiUrl] = useState("");
  const [evolutionApiKey, setEvolutionApiKey] = useState("");
  const [zApiUrl, setZApiUrl] = useState("");
  const [zApiToken, setZApiToken] = useState("");
  const [loading, setLoading] = useState(false);
  
  const supabaseWebhookUrl = `${window.location.origin.replace('lovableproject.com', 'functions.supabase.co')}/webhook-whatsapp`;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };
  
  const handleSaveSettings = async () => {
    if (!profile?.is_admin) {
      toast.error("Apenas administradores podem atualizar configurações");
      return;
    }
    
    setLoading(true);
    
    try {
      // Chamar Edge Function para atualizar secrets
      const { error } = await supabase.functions.invoke("update-secret", {
        body: {
          secrets: {
            EVOLUTION_API_URL: evolutionApiUrl,
            EVOLUTION_API_KEY: evolutionApiKey,
            ZAPI_URL: zApiUrl,
            ZAPI_TOKEN: zApiToken
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error);
      toast.error(`Erro ao salvar configurações: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Configurações do WhatsApp</h1>
      
      <Tabs defaultValue="integration">
        <TabsList className="mb-4">
          <TabsTrigger value="integration">Integração</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Mensagem</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolution API</CardTitle>
                <CardDescription>
                  Configure a integração com a Evolution API para WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL da API</label>
                  <Input 
                    placeholder="https://seu-servidor-evolution-api.com"
                    value={evolutionApiUrl}
                    onChange={(e) => setEvolutionApiUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chave da API</label>
                  <Input 
                    type="password"
                    placeholder="Chave secreta da Evolution API"
                    value={evolutionApiKey}
                    onChange={(e) => setEvolutionApiKey(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Z-API (Alternativa)</CardTitle>
                <CardDescription>
                  Configuração alternativa usando Z-API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID da Instância</label>
                  <Input 
                    placeholder="ID da instância Z-API"
                    value={zApiUrl}
                    onChange={(e) => setZApiUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token</label>
                  <Input 
                    type="password"
                    placeholder="Token da Z-API"
                    value={zApiToken}
                    onChange={(e) => setZApiToken(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Webhook</CardTitle>
              <CardDescription>
                Configure sua API do WhatsApp para enviar eventos para este webhook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm break-all">{supabaseWebhookUrl}</p>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(supabaseWebhookUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-4">Configuração na Evolution API</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Para configurar o webhook na Evolution API, use o seguinte comando:
                </p>
                <div className="p-3 bg-gray-900 text-gray-100 rounded-md overflow-x-auto">
                  <pre className="text-xs">
{`// Exemplo usando curl
curl -X POST \\
  ${evolutionApiUrl || "https://sua-evolution-api.com"}/webhook/set \\
  -H 'Content-Type: application/json' \\
  -H 'apikey: ${evolutionApiKey || "sua-chave-api"}' \\
  -d '{
    "url": "${supabaseWebhookUrl}",
    "enabled": true
  }'`}
                  </pre>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(`curl -X POST \\\n  ${evolutionApiUrl || "https://sua-evolution-api.com"}/webhook/set \\\n  -H 'Content-Type: application/json' \\\n  -H 'apikey: ${evolutionApiKey || "sua-chave-api"}' \\\n  -d '{\n    "url": "${supabaseWebhookUrl}",\n    "enabled": true\n  }'`)}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copiar comando
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Modelos de Mensagem</CardTitle>
              <CardDescription>
                Configure modelos de mensagem para respostas automatizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppSettings;
