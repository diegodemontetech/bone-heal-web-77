
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Smartphone, QrCode, RefreshCw, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { WhatsAppInstance } from "./types";

interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  onSelect: () => void;
  onRefreshQr: () => Promise<any>;
  onDelete: () => Promise<any>;
}

const WhatsAppInstanceCard = ({
  instance,
  onSelect,
  onRefreshQr,
  onDelete
}: WhatsAppInstanceCardProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleRefreshQr = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      await onRefreshQr();
      setShowQrCode(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a instância "${instance.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onSelect}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">{instance.name}</CardTitle>
            <Badge
              variant={instance.status === "connected" ? "default" : "outline"}
              className={`${
                instance.status === "connected"
                  ? "bg-green-500 hover:bg-green-500"
                  : instance.status === "connecting"
                  ? "text-yellow-500 border-yellow-500"
                  : "text-red-500 border-red-500"
              }`}
            >
              {instance.status === "connected"
                ? "Conectado"
                : instance.status === "connecting"
                ? "Conectando"
                : "Desconectado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div>ID: {instance.id.substring(0, 8)}...</div>
          <div>
            Criado em:{" "}
            {format(new Date(instance.created_at), "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </div>
          
          {instance.status === "connecting" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={(e) => {
                e.stopPropagation();
                setShowQrCode(true);
              }}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Ver QR Code
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshQr}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            {instance.status === "connected" ? "Reconectar" : "Atualizar QR"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code para WhatsApp - {instance.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            {instance.qr_code ? (
              <div className="border p-4 rounded-lg bg-white">
                <img 
                  src={instance.qr_code} 
                  alt="QR Code para WhatsApp" 
                  className="w-64 h-64"
                />
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-muted-foreground">QR Code não disponível.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setShowQrCode(false);
                    handleRefreshQr(new MouseEvent('click') as unknown as React.MouseEvent);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Gerar QR Code
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Escaneie este QR Code com seu WhatsApp para conectar esta instância.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatsAppInstanceCard;
