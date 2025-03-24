
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash, QrCode } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { WhatsAppInstance } from "@/components/admin/whatsapp/types";

interface InstanceCardProps {
  instance: WhatsAppInstance;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onRefreshQr: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InstanceCard = ({
  instance,
  isSelected,
  onSelect,
  onRefreshQr,
  onDelete
}: InstanceCardProps) => {
  const handleSelect = () => {
    onSelect(instance.id);
  };

  const handleRefreshQr = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRefreshQr(instance.id);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(instance.id);
  };

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

  const statusColor = getStatusColor(instance.status);
  const formattedDate = instance.updated_at
    ? formatDistanceToNow(new Date(instance.updated_at), {
        addSuffix: true,
        locale: ptBR
      })
    : "";

  return (
    <Card
      onClick={handleSelect}
      className={`cursor-pointer transition-all hover:border-primary ${
        isSelected ? "border-primary ring-2 ring-primary/20" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">
              {instance.instance_name || "Sem nome"}
            </h3>
            <div className="flex items-center mt-1">
              <span
                className={`${statusColor} h-2.5 w-2.5 rounded-full mr-2`}
              ></span>
              <span className="text-sm capitalize">{instance.status}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Atualizado {formattedDate}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefreshQr}
              title="Atualizar QR Code"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              title="Excluir instância"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {instance.status === "disconnected" && instance.qr_code && (
          <div className="mt-4 flex justify-center">
            <div className="bg-white p-2 rounded-md">
              <img
                src={instance.qr_code}
                alt="QR Code para WhatsApp"
                className="h-32 w-32 object-contain"
              />
            </div>
          </div>
        )}

        {instance.status === "disconnected" && !instance.qr_code && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleRefreshQr}
            >
              <QrCode className="h-4 w-4 mr-1" />
              Gerar QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
