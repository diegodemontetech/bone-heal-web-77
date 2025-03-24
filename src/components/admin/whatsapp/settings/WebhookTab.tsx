
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Check, Copy as CopyIcon, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface WebhookTabProps {
  webhookUrl: string;
  copied: boolean;
  onCopyToClipboard: () => void;
}

export const WebhookTab: React.FC<WebhookTabProps> = ({
  webhookUrl,
  copied,
  onCopyToClipboard
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook do WhatsApp</CardTitle>
        <CardDescription>
          Configuração do webhook para receber mensagens do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800 font-semibold">Como funciona</AlertTitle>
          <AlertDescription className="text-blue-700">
            Este webhook permite que você receba mensagens do WhatsApp em tempo real. 
            Use com a Evolution API para automação completa.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">URL do Webhook</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyToClipboard}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copiado
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 mr-1" />
                  Copiar
                </>
              )}
            </Button>
          </div>
          
          <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
            {webhookUrl}
          </div>
          
          <p className="text-sm text-muted-foreground">
            Copie esta URL e adicione como webhook na Evolution API ou Z-API.
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Passo-a-passo para configuração na Evolution API</h3>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <p className="text-sm">
                Acesse o painel da Evolution API (https://evolution-api.com/panel ou sua instalação personalizada)
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <p className="text-sm">
                Na seção de configurações, procure por "Webhooks" ou "Callbacks"
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <p className="text-sm">
                Adicione a URL do webhook acima no campo apropriado
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <p className="text-sm">
                Certifique-se de selecionar os eventos de mensagem recebida (received_message)
              </p>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                5
              </div>
              <p className="text-sm">
                Salve as configurações e teste enviando uma mensagem para seu número do WhatsApp
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
