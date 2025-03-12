
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2, MessageSquare } from "lucide-react";
import { WhatsAppInstance } from "../../../types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      case "connecting":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const formattedDate = formatDistanceToNow(new Date(instance.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{instance.name || instance.instance_name}</h3>
          <Badge className={getStatusColor(instance.status)}>
            {instance.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">Criado {formattedDate}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onRefreshQr}>
            <RefreshCw className="h-4 w-4 mr-1" />
            QR Code
          </Button>
          <Button size="sm" onClick={onSelect}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
