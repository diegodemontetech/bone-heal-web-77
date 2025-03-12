
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash, MessageCircle } from "lucide-react";
import { WhatsAppInstance } from "../../../types";

interface InstanceCardProps {
  instance: WhatsAppInstance;
  onSelect: () => void;
  onRefreshQr: () => Promise<any>;
  onDelete: () => void;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({
  instance,
  onSelect,
  onRefreshQr,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected':
        return <Badge className="bg-green-500">Conectado</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Desconectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500">Conectando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleRefreshQr = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onRefreshQr();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{instance.instance_name}</span>
          {getStatusBadge(instance.status)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Criado em: {new Date(instance.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshQr}
              title="Atualizar QR Code"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSelect}
              title="Ver Mensagens"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
              title="Excluir Instância"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
