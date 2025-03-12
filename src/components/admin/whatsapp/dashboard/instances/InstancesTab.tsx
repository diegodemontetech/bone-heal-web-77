
import React from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppInstance } from "../../../types";
import { InstanceCard } from "./InstanceCard";
import { Loader2, Plus } from "lucide-react";

interface InstancesTabProps {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  error: Error | null;
  onSelect: (instanceId: string) => void;
  onRefreshQr: (instanceId: string) => Promise<any>;
  onDelete: (instanceId: string) => Promise<boolean>;
  openCreateDialog: () => void;
}

export const InstancesTab: React.FC<InstancesTabProps> = ({
  instances,
  isLoading,
  error,
  onSelect,
  onRefreshQr,
  onDelete,
  openCreateDialog
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Erro ao carregar instâncias: {error.message}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button onClick={openCreateDialog} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Nova Instância
        </Button>
      </div>
      
      {instances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma instância encontrada. Crie uma nova para começar.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {instances.map((instance) => (
            <InstanceCard 
              key={instance.id} 
              instance={instance} 
              onSelect={() => onSelect(instance.id)} 
              onRefreshQr={() => onRefreshQr(instance.id)}
              onDelete={() => onDelete(instance.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
