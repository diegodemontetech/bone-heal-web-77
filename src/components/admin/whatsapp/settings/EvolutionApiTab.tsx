
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Settings, Smartphone } from 'lucide-react';

interface EvolutionApiTabProps {
  evolutionUrl: string;
  evolutionKey: string;
  instanceName: string;
  saving: boolean;
  qrCodeLoading: boolean;
  onEvolutionUrlChange: (url: string) => void;
  onEvolutionKeyChange: (key: string) => void;
  onInstanceNameChange: (name: string) => void;
  onSaveSettings: () => Promise<void>;
  onCreateInstance: () => Promise<void>;
  onCheckStatus: () => Promise<void>;
}

export const EvolutionApiTab: React.FC<EvolutionApiTabProps> = ({
  evolutionUrl,
  evolutionKey,
  instanceName,
  saving,
  qrCodeLoading,
  onEvolutionUrlChange,
  onEvolutionKeyChange,
  onInstanceNameChange,
  onSaveSettings,
  onCreateInstance,
  onCheckStatus
}) => {
  return (
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
            onChange={(e) => onEvolutionUrlChange(e.target.value)}
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
            onChange={(e) => onEvolutionKeyChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instance-name">Nome da Instância</Label>
          <Input
            id="instance-name"
            placeholder="default"
            value={instanceName}
            onChange={(e) => onInstanceNameChange(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Nome da instância para identificar diferentes conexões
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onSaveSettings} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
            Salvar Configurações
          </Button>
          
          <Button variant="outline" onClick={onCreateInstance} disabled={qrCodeLoading}>
            {qrCodeLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Smartphone className="h-4 w-4 mr-2" />}
            Criar Instância
          </Button>
          
          <Button variant="secondary" onClick={onCheckStatus}>
            Verificar Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
