
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { InstanceCard } from "./InstanceCard";
import { InstancesTabProps } from "@/components/admin/whatsapp/types";

export const InstancesTab = ({
  instances,
  isLoading,
  onConnect,
  onDisconnect,
  onDelete,
  onCreateInstance,
  onCreateDialogOpen
}: InstancesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onCreateDialogOpen}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Instância
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Carregando instâncias...</span>
        </div>
      ) : instances.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h3 className="font-medium text-lg mb-2">Nenhuma instância encontrada</h3>
          <p className="text-muted-foreground mb-4">
            Crie uma nova instância para começar a usar o WhatsApp
          </p>
          <Button onClick={onCreateDialogOpen}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Instância
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instances.map((instance) => (
            <InstanceCard
              key={instance.id}
              instance={instance}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
