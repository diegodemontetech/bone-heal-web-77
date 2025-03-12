
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, QrCode, Trash, RefreshCw } from 'lucide-react';
import { WhatsAppInstance } from '@/types/automation';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  onRefreshQr: (instanceId: string) => Promise<string>;
  onSelect: (instance: WhatsAppInstance) => void;
  onDelete: (instanceId: string) => void;
}

const WhatsAppInstanceCard: React.FC<WhatsAppInstanceCardProps> = ({
  instance,
  onRefreshQr,
  onSelect,
  onDelete
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState(instance.qr_code || '');
  const [showQrCode, setShowQrCode] = useState(false);

  const handleRefreshQr = async () => {
    if (instance.status === 'connected') {
      toast.info('Esta instância já está conectada');
      return;
    }

    setIsRefreshing(true);
    try {
      const qrCode = await onRefreshQr(instance.id);
      setQrCodeValue(qrCode);
      setShowQrCode(true);
    } catch (error) {
      toast.error('Erro ao atualizar QR Code');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = () => {
    switch (instance.status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-red-500';
      case 'connecting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Smartphone className="mr-2 h-5 w-5" />
            {instance.name}
          </CardTitle>
          <Badge className={getStatusColor()}>
            {instance.status === 'connected' ? 'Conectado' : 
             instance.status === 'disconnected' ? 'Desconectado' : 'Conectando'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {showQrCode && instance.status !== 'connected' && qrCodeValue ? (
          <div className="flex flex-col items-center justify-center p-4">
            <QRCode value={qrCodeValue} size={200} />
            <p className="mt-2 text-sm text-gray-500">
              Escaneie este QR Code no WhatsApp do seu celular
            </p>
          </div>
        ) : (
          <div className="py-6 text-center">
            {instance.status === 'connected' ? (
              <p>WhatsApp conectado e pronto para uso</p>
            ) : (
              <p>Clique em "Exibir QR Code" para conectar</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {!showQrCode && instance.status !== 'connected' && (
            <Button 
              variant="outline" 
              onClick={handleRefreshQr} 
              disabled={isRefreshing}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Exibir QR Code
            </Button>
          )}
          {showQrCode && instance.status !== 'connected' && (
            <Button 
              variant="outline" 
              onClick={handleRefreshQr} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar QR
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(instance.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => onSelect(instance)}
            disabled={instance.status !== 'connected'}
          >
            Usar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppInstanceCard;
