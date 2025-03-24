
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, RefreshCw, Clipboard, Check, QrCodeIcon, ApiIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWhatsAppSettings } from "@/hooks/admin/whatsapp/useWhatsAppSettings";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CreateInstanceDialog } from "@/components/admin/whatsapp/dashboard/dialogs/CreateInstanceDialog";
import { WhatsAppInstance } from "@/components/admin/whatsapp/types";

const WhatsAppSettings = () => {
  const {
    loading,
    saving,
    copied,
    qrCodeData,
    qrCodeLoading,
    evolutionUrl,
    evolutionKey,
    zapiInstanceId,
    zapiToken,
    webhookUrl,
    instances,
    instancesLoading,
    setEvolutionUrl,
    setEvolutionKey,
    setZapiInstanceId,
    setZapiToken,
    saveSecrets,
    copyToClipboard,
    createInstance,
    refreshQrCode,
    checkConnectionStatus,
    deleteInstance
  } = useWhatsAppSettings();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateInstance = async (instanceName: string): Promise<WhatsAppInstance | null> => {
    setIsCreating(true);
    try {
      const instance = await createInstance(instanceName);
      setIsDialogOpen(false);
      return instance as WhatsAppInstance | null;
    } catch (error) {
      console.error("Erro ao criar instância:", error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefreshQr = async (instanceId: string): Promise<any> => {
    return await refreshQrCode(instanceId);
  };

  const handleDeleteInstanceHandler = async (instanceId: string): Promise<boolean> => {
    await deleteInstance(instanceId);
    return true;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações do WhatsApp</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Adicionar Instância</Button>
      </div>

      <Tabs defaultValue="instances">
        <TabsList className="mb-6">
          <TabsTrigger value="instances">
            <QrCodeIcon className="w-4 h-4 mr-2" />
            Instâncias
          </TabsTrigger>
          <TabsTrigger value="evolution-api">
            <ApiIcon className="w-4 h-4 mr-2" />
            Evolution API
          </TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="instances">
          <Card>
            <CardHeader>
              <CardTitle>Instâncias do WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              {instancesLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : instances.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-medium mb-2">Nenhuma instância encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione sua primeira instância para começar a usar o WhatsApp.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    Adicionar Instância
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {instances.map((instance) => (
                    <Card key={instance.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/40 pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{instance.name}</CardTitle>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            instance.status === 'connected' ? 'bg-green-100 text-green-800' : 
                            instance.status === 'disconnected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {instance.status}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4">
                        {instance.qr_code && instance.status !== 'connected' ? (
                          <div className="flex flex-col items-center mb-4">
                            <div className="bg-white p-4 rounded-md mb-2">
                              <div className="relative h-48 w-48">
                                <Image
                                  src={`data:image/png;base64,${instance.qr_code}`}
                                  alt="QR Code"
                                  layout="fill"
                                  objectFit="contain"
                                />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              Escaneie o QR Code no aplicativo do WhatsApp para conectar
                            </p>
                          </div>
                        ) : instance.status !== 'connected' ? (
                          <div className="flex justify-center mb-4">
                            <Button 
                              onClick={() => handleRefreshQr(instance.id)}
                              className="w-full"
                            >
                              <QrCode className="mr-2 h-4 w-4" />
                              Gerar QR Code
                            </Button>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-green-600 font-medium">
                            WhatsApp conectado com sucesso!
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => handleRefreshQr(instance.id)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Atualizar Status
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleDeleteInstanceHandler(instance.id)}
                          >
                            Excluir Instância
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution-api">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Evolution API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="evolution-url">URL da API</Label>
                  <Input
                    id="evolution-url"
                    placeholder="https://sua-api-evolution.com"
                    value={evolutionUrl}
                    onChange={(e) => setEvolutionUrl(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="evolution-key">Chave da API</Label>
                  <Input
                    id="evolution-key"
                    type="password"
                    placeholder="Chave secreta da API"
                    value={evolutionKey}
                    onChange={(e) => setEvolutionKey(e.target.value)}
                  />
                </div>
                
                <Button onClick={saveSecrets} disabled={saving}>
                  {saving ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="webhook-url">URL de Webhook</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-url"
                      value={webhookUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure esta URL como webhook no painel da Evolution API
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="rounded-md bg-muted p-4">
                  <h3 className="text-sm font-medium mb-2">Informações adicionais</h3>
                  <p className="text-sm text-muted-foreground">
                    Para receber notificações do WhatsApp, você precisa configurar o webhook
                    acima na sua instância da Evolution API ou Z-API.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CreateInstanceDialog
        isOpen={isDialogOpen}
        isCreating={isCreating}
        onClose={() => setIsDialogOpen(false)}
        onOpenChange={setIsDialogOpen}
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
};

export default WhatsAppSettings;
