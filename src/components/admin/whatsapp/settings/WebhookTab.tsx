
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

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
              onClick={onCopyToClipboard}
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
  );
};
