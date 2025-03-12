
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Settings } from 'lucide-react';

interface ZapiTabProps {
  zapiInstanceId: string;
  zapiToken: string;
  saving: boolean;
  onZapiInstanceIdChange: (id: string) => void;
  onZapiTokenChange: (token: string) => void;
  onSaveSettings: () => Promise<void>;
}

export const ZapiTab: React.FC<ZapiTabProps> = ({
  zapiInstanceId,
  zapiToken,
  saving,
  onZapiInstanceIdChange,
  onZapiTokenChange,
  onSaveSettings
}) => {
  return (
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
            onChange={(e) => onZapiInstanceIdChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zapi-token">Token de Acesso</Label>
          <Input
            id="zapi-token"
            type="password"
            placeholder="Token de acesso Z-API"
            value={zapiToken}
            onChange={(e) => onZapiTokenChange(e.target.value)}
          />
        </div>
        
        <Button onClick={onSaveSettings} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
