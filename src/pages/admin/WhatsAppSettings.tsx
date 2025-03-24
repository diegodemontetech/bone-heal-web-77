
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageCircle, Settings, Smartphone, AlertTriangle } from 'lucide-react';
import { useWhatsAppSettings } from '@/hooks/admin/whatsapp/useWhatsAppSettings';
import { EvolutionApiTab } from '@/components/admin/whatsapp/settings/EvolutionApiTab';
import { ZapiTab } from '@/components/admin/whatsapp/settings/ZapiTab';
import { WebhookTab } from '@/components/admin/whatsapp/settings/WebhookTab';
import { QrCodeTab } from '@/components/admin/whatsapp/settings/QrCodeTab';
import { InstancesManager } from '@/components/admin/whatsapp/settings/InstancesManager';

const AdminWhatsAppSettings = () => {
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
    instanceName,
    webhookUrl,
    setEvolutionUrl,
    setEvolutionKey,
    setZapiInstanceId,
    setZapiToken,
    setInstanceName,
    saveSecrets,
    copyToClipboard,
    createInstance: createInstanceFn,
    generateQRCode,
    checkConnectionStatus,
    instances,
    instancesLoading,
    refreshQrCode,
    deleteInstance
  } = useWhatsAppSettings();

  const [activeTab, setActiveTab] = useState("evolution");

  // Função wrapper para garantir que createInstance receba um parâmetro
  const createInstance = async () => {
    if (!instanceName.trim()) {
      return;
    }
    await createInstanceFn(instanceName);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Configurações WhatsApp
          </h1>
          <p className="text-muted-foreground">Configure a integração com o WhatsApp para atendimento automático</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold">Atenção!</AlertTitle>
            <AlertDescription className="text-amber-700">
              Configure a API Evolution abaixo e depois crie até 5 instâncias do WhatsApp para conectar com diferentes números.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="evolution" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Evolution API</span>
              </TabsTrigger>
              <TabsTrigger value="zapi" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Z-API</span>
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Webhook</span>
              </TabsTrigger>
              <TabsTrigger value="qrcode" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <span className="hidden md:inline">QR Code</span>
              </TabsTrigger>
              <TabsTrigger value="instances" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <span className="hidden md:inline">Instâncias</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="evolution">
              <EvolutionApiTab
                evolutionUrl={evolutionUrl}
                evolutionKey={evolutionKey}
                instanceName={instanceName}
                saving={saving}
                qrCodeLoading={qrCodeLoading}
                onEvolutionUrlChange={setEvolutionUrl}
                onEvolutionKeyChange={setEvolutionKey}
                onInstanceNameChange={setInstanceName}
                onSaveSettings={saveSecrets}
                onCreateInstance={createInstance}
                onCheckStatus={checkConnectionStatus}
              />
            </TabsContent>
            
            <TabsContent value="zapi">
              <ZapiTab
                zapiInstanceId={zapiInstanceId}
                zapiToken={zapiToken}
                saving={saving}
                onZapiInstanceIdChange={setZapiInstanceId}
                onZapiTokenChange={setZapiToken}
                onSaveSettings={saveSecrets}
              />
            </TabsContent>
            
            <TabsContent value="webhook">
              <WebhookTab
                webhookUrl={webhookUrl}
                copied={copied}
                onCopyToClipboard={copyToClipboard}
              />
            </TabsContent>
            
            <TabsContent value="qrcode">
              <QrCodeTab
                qrCodeData={qrCodeData}
                qrCodeLoading={qrCodeLoading}
                onGenerateQRCode={generateQRCode}
              />
            </TabsContent>

            <TabsContent value="instances">
              <InstancesManager 
                instances={instances}
                isLoading={instancesLoading}
                onRefreshQr={refreshQrCode}
                onDeleteInstance={deleteInstance}
                onCreateInstance={createInstanceFn}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdminWhatsAppSettings;
