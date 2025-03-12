
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { InstanceCard } from "./InstanceCard";
import { InstancesTabProps } from "@/components/admin/whatsapp/types";

export const InstancesTab: React.FC<InstancesTabProps> = ({
  instances,
  isLoading,
  onSelectInstance,
  onRefreshQr,
  onDeleteInstance,
  onCreateDialogOpen
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (instances.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-2">Nenhuma instância encontrada</h3>
          <p className="text-muted-foreground mb-6">
            Crie uma nova instância para começar a usar o WhatsApp
          </p>
          <Button onClick={onCreateDialogOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Instância
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {instances.map((instance) => (
        <InstanceCard
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
