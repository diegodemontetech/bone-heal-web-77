
import React from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppInstance } from "@/components/admin/whatsapp/types";
import WhatsAppInstanceCard from "@/components/admin/whatsapp/WhatsAppInstanceCard";
import { Loader2, Plus } from "lucide-react";

interface InstancesTabProps {
  instances: WhatsAppInstance[];
  isLoading: boolean;
  onSelectInstance: (instanceId: string) => void;
  onRefreshQr: (instanceId: string) => Promise<any>;
  onDeleteInstance: (instanceId: string) => Promise<any>;
  onCreateDialogOpen: () => void;
}

const InstancesTab = ({
  instances,
  isLoading,
  onSelectInstance,
  onRefreshQr,
  onDeleteInstance,
  onCreateDialogOpen,
}: InstancesTabProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (instances.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-4">
          Você ainda não tem nenhuma instância WhatsApp.
        </p>
        <Button onClick={() => onCreateDialogOpen && onCreateDialogOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Primeira Instância
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {instances.map((instance) => (
        <WhatsAppInstanceCard
          key={instance.id}
          instance={instance}
          onSelect={() => onSelectInstance(instance.id)}
          onRefreshQr={() => onRefreshQr(instance.id)}
          onDelete={() => onDeleteInstance(instance.id)}
        />
      ))}
    </div>
  );
};

export default InstancesTab;
