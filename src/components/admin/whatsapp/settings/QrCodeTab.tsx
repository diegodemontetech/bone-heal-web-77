
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, QrCode } from 'lucide-react';

interface QrCodeTabProps {
  qrCodeData: string;
  qrCodeLoading: boolean;
  onGenerateQRCode: () => Promise<void>;
}

export const QrCodeTab: React.FC<QrCodeTabProps> = ({
  qrCodeData,
  qrCodeLoading,
  onGenerateQRCode
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code de Conexão</CardTitle>
        <CardDescription>
          Gere o QR Code para conectar o WhatsApp com sua instância
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onGenerateQRCode}
            disabled={qrCodeLoading}
            className="mb-6"
          >
            {qrCodeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {qrCodeData ? 'Regenerar QR Code' : 'Gerar QR Code'}
          </Button>
        </div>
        
        <div className="flex justify-center">
          {qrCodeLoading ? (
            <div className="bg-gray-100 p-4 rounded-lg">
              <Loader2 className="h-32 w-32 animate-spin text-primary" />
            </div>
          ) : qrCodeData ? (
            <div className="bg-white p-4 rounded-lg">
              <img 
                src={qrCodeData} 
                alt="QR Code para WhatsApp" 
                className="w-64 h-64"
              />
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg inline-flex items-center justify-center">
              <QrCode className="h-32 w-32 text-muted-foreground" />
            </div>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Escaneie este QR Code com o WhatsApp para conectar sua instância
        </p>
      </CardContent>
    </Card>
  );
};
