
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Settings } from 'lucide-react';
import { useWhatsAppSettings } from '@/hooks/admin/whatsapp/useWhatsAppSettings';
import { EvolutionApiTab } from '@/components/admin/whatsapp/settings/EvolutionApiTab';
import { ZapiTab } from '@/components/admin/whatsapp/settings/ZapiTab';
import { WebhookTab } from '@/components/admin/whatsapp/settings/WebhookTab';
import { QrCodeTab } from '@/components/admin/whatsapp/settings/QrCodeTab';

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
    createInstance,
    generateQRCode,
    checkConnectionStatus
  } = useWhatsAppSettings();

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
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdminWhatsAppSettings;
