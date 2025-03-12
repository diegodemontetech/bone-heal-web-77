
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, RefreshCw, Trash } from "lucide-react";
import { WhatsAppInstance } from "./types";

export interface WhatsAppInstanceCardProps {
  instance: WhatsAppInstance;
  onSelect: () => void;
  onRefreshQr: () => Promise<any>;
  onDelete: () => void;
  key?: string;
}

const WhatsAppInstanceCard = ({ 
  instance, 
  onSelect, 
  onRefreshQr,
  onDelete 
}: WhatsAppInstanceCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">{instance.name || instance.instance_name}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          instance.status === 'connected' ? 'bg-green-100 text-green-800' : 
          instance.status === 'disconnected' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {instance.status}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onSelect}
        >
          Selecionar
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center gap-1"
          onClick={onRefreshQr}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Atualizar QR</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center gap-1 text-red-600 hover:text-red-700"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
          <span>Excluir</span>
        </Button>
      </div>
    </Card>
  );
};

export default WhatsAppInstanceCard;
