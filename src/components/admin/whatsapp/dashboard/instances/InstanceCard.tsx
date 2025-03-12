
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw, Trash2, QrCode } from "lucide-react";
import { WhatsAppInstanceCardProps } from "@/components/admin/whatsapp/types";

export const InstanceCard: React.FC<WhatsAppInstanceCardProps> = ({
  instance,
  onSelect,
  onRefreshQr,
  onDelete
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshQr = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshQr();
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{instance.name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            {instance.status || 'Desconectado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {instance.qr_code ? (
          <div className="bg-white p-2 rounded flex justify-center">
            <img 
              src={instance.qr_code} 
              alt="QR Code" 
              className="w-full max-w-[200px] h-auto"
            />
          </div>
        ) : (
          <div className="h-[200px] bg-muted flex items-center justify-center rounded">
            <QrCode className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSelect}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshQr}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
