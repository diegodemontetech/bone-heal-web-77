
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Smartphone, QrCode, X, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { WhatsAppInstanceCardProps } from "@/components/admin/whatsapp/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const InstanceCard = ({ instance, onConnect, onDisconnect, onDelete }: WhatsAppInstanceCardProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "connecting":
        return "Conectando";
      case "disconnected":
        return "Desconectado";
      default:
        return "Desconhecido";
    }
  };

  const handleConnectClick = async () => {
    try {
      setLoading("connect");
      await onConnect(instance.id);
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnectClick = async () => {
    try {
      setLoading("disconnect");
      await onDisconnect(instance.id);
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteClick = async () => {
    if (!confirm(`Tem certeza que deseja excluir a instância "${instance.instance_name}"?`)) {
      return;
    }

    try {
      setLoading("delete");
      await onDelete(instance.id);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{instance.instance_name}</CardTitle>
            <Badge 
              variant="outline" 
              className={`flex items-center ${
                instance.status === "connected" ? "text-green-500" : 
                instance.status === "connecting" ? "text-yellow-500" : 
                "text-red-500"
              }`}
            >
              <span className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(instance.status)}`}></span>
              {getStatusText(instance.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {(instance.status === "connecting" || instance.status === "awaiting_connection" || instance.qr_code) && (
            <div className="flex justify-center mb-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowQrCode(true)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Visualizar QR Code
              </Button>
            </div>
          )}
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>ID:</span>
              <span className="font-mono">{instance.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span>Criado em:</span>
              <span>{format(new Date(instance.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          {instance.status === "connected" ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDisconnectClick}
              disabled={loading !== null}
            >
              {loading === "disconnect" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <X className="h-4 w-4 mr-1" />
              )}
              Desconectar
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleConnectClick}
              disabled={loading !== null}
            >
              {loading === "connect" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : instance.status === "connecting" ? (
                <RefreshCw className="h-4 w-4 mr-1" />
              ) : (
                <Smartphone className="h-4 w-4 mr-1" />
              )}
              {instance.status === "connecting" ? "Atualizar QR" : "Conectar"}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDeleteClick}
            disabled={loading !== null}
            className="text-destructive hover:text-destructive"
          >
            {loading === "delete" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code para WhatsApp</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
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
                    handleConnectClick();
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

export default InstanceCard;
