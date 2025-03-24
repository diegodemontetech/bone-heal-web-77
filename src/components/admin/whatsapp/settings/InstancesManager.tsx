
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Plus, QrCode, RefreshCw, Trash2, PhoneOutgoing, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsAppInstance } from '@/components/admin/whatsapp/types';
import { toast } from 'sonner';

interface InstancesManagerProps {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  onRefreshQr: (instanceId: string) => Promise<any>;
  onDeleteInstance: (instanceId: string) => Promise<boolean>;
  onCreateInstance: (instanceName: string) => Promise<any>;
}

export const InstancesManager: React.FC<InstancesManagerProps> = ({ 
  instances, 
  isLoading, 
  onRefreshQr, 
  onDeleteInstance,
  onCreateInstance
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const [selectedInstanceName, setSelectedInstanceName] = useState<string | null>(null);

  const handleRefreshQr = async (instanceId: string, instanceName: string) => {
    setRefreshingId(instanceId);
    try {
      const qrCode = await onRefreshQr(instanceId);
      if (qrCode) {
        setSelectedQrCode(qrCode);
        setSelectedInstanceName(instanceName);
        setQrDialogOpen(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar QR code:", error);
      toast.error("Falha ao atualizar QR code");
    } finally {
      setRefreshingId(null);
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta instância?")) {
      setDeletingId(instanceId);
      try {
        await onDeleteInstance(instanceId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) {
      toast.error("Nome da instância não pode ser vazio");
      return;
    }

    try {
      await onCreateInstance(newInstanceName);
      setNewInstanceName('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar instância:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'awaiting_connection':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check className="h-3 w-3" />;
      case 'disconnected':
        return <AlertCircle className="h-3 w-3" />;
      case 'awaiting_connection':
        return <PhoneOutgoing className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Instâncias do WhatsApp</CardTitle>
          <CardDescription>Gerenciamento de conexões do WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Instâncias do WhatsApp</CardTitle>
          <CardDescription>Gerencie suas conexões do WhatsApp (máximo 5)</CardDescription>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          disabled={instances.length >= 5}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Instância
        </Button>
      </CardHeader>
      <CardContent>
        {instances.length === 0 ? (
          <div className="text-center py-8 border rounded-lg border-dashed">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <PhoneOutgoing className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-muted-foreground mb-1">Nenhuma instância criada</h3>
            <p className="text-sm text-muted-foreground mb-4">Crie sua primeira instância para conectar ao WhatsApp</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Instância
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {instances.map((instance) => (
                <div 
                  key={instance.id} 
                  className="border rounded-lg p-4 transition-all hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-lg">{instance.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className={`flex items-center gap-1 text-xs ${getStatusColor(instance.status)}`}>
                          {getStatusIcon(instance.status)}
                          {instance.status === 'connected' ? 'Conectado' : 
                           instance.status === 'disconnected' ? 'Desconectado' : 
                           instance.status === 'awaiting_connection' ? 'Aguardando conexão' : 
                           instance.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Criado em: {format(new Date(instance.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleRefreshQr(instance.id, instance.name)}
                        disabled={refreshingId === instance.id}
                      >
                        {refreshingId === instance.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <QrCode className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteInstance(instance.id)}
                        disabled={deletingId === instance.id}
                      >
                        {deletingId === instance.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {instance.qr_code && (
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => {
                          setSelectedQrCode(instance.qr_code);
                          setSelectedInstanceName(instance.name);
                          setQrDialogOpen(true);
                        }}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Ver QR Code
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Dialog para criar nova instância */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Instância WhatsApp</DialogTitle>
              <DialogDescription>
                Crie uma nova instância para conectar ao WhatsApp.
                Você pode ter até 5 instâncias ativas simultaneamente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="instance-name">Nome da Instância</Label>
                <Input
                  id="instance-name"
                  placeholder="Ex: Departamento Comercial"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Use um nome descritivo para identificar a finalidade desta instância.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateInstance}>
                Criar Instância
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog para exibir QR Code */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code - {selectedInstanceName}</DialogTitle>
              <DialogDescription>
                Escaneie este QR Code com o WhatsApp no seu celular para conectar esta instância.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              {selectedQrCode && (
                <div className="border p-4 rounded-lg bg-white">
                  <img 
                    src={`data:image/png;base64,${selectedQrCode}`} 
                    alt="QR Code para WhatsApp" 
                    className="w-64 h-64"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Este QR Code expira após alguns minutos. Se expirar, gere um novo.
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={() => setQrDialogOpen(false)}>
                Fechar
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  const instance = instances.find(i => i.qr_code === selectedQrCode);
                  if (instance) {
                    handleRefreshQr(instance.id, instance.name);
                  }
                }}
                className="sm:mt-0 mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar QR Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
