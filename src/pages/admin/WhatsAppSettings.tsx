
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, QrCode, Webhook, FileJson } from "lucide-react";
import { useWhatsAppSettings } from "@/hooks/admin/whatsapp/useWhatsAppSettings";
import { EvolutionApiTab } from "@/components/admin/whatsapp/settings/EvolutionApiTab";
import { ZapiTab } from "@/components/admin/whatsapp/settings/ZapiTab";
import { QrCodeTab } from "@/components/admin/whatsapp/settings/QrCodeTab";
import { WebhookTab } from "@/components/admin/whatsapp/settings/WebhookTab";
import { InstancesManager } from "@/components/admin/whatsapp/settings/InstancesManager";
import { toast } from "sonner";

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
    checkConnectionStatus,
    instances,
    instancesLoading,
    refreshQrCode,
    deleteInstance
  } = useWhatsAppSettings();

  const [activeTab, setActiveTab] = useState("evolution");

  const handleCreateInstance = async () => {
    if (!instanceName) {
      toast.error("Por favor, informe um nome para a instância");
      return;
    }
    
    await createInstance(instanceName);
    return true;
  };

  const handleRefreshQr = async (instanceId: string) => {
    await refreshQrCode(instanceId);
    return true;
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          Configurações do WhatsApp
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure suas instâncias e conexões com o WhatsApp
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evolution" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            <span className="hidden sm:inline">Evolution API</span>
            <span className="sm:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="zapi" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            <span className="hidden sm:inline">Z-API</span>
            <span className="sm:hidden">Z-API</span>
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">QR Code</span>
            <span className="sm:hidden">QR</span>
          </TabsTrigger>
          <TabsTrigger value="webhook" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span className="hidden sm:inline">Webhook</span>
            <span className="sm:hidden">Hook</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
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
              onCreateInstance={handleCreateInstance}
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

          <TabsContent value="qrcode">
            <QrCodeTab
              qrCodeData={qrCodeData || ""}
              qrCodeLoading={qrCodeLoading}
              onGenerateQRCode={generateQRCode}
            />
          </TabsContent>

          <TabsContent value="webhook">
            <WebhookTab
              webhookUrl={webhookUrl}
              copied={copied}
              onCopyToClipboard={copyToClipboard}
            />
          </TabsContent>
        </div>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Instâncias do WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <InstancesManager
            instances={instances}
            loading={instancesLoading}
            onRefreshQr={handleRefreshQr}
            onDeleteInstance={deleteInstance}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSettings;
