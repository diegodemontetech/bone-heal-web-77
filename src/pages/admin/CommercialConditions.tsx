
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { useCommercialConditions } from "@/hooks/admin/use-commercial-conditions";
import CommercialConditionDialog from "@/components/admin/commercial-conditions/CommercialConditionDialog";
import CommercialConditionsList from "@/components/admin/commercial-conditions/CommercialConditionsList";

const CommercialConditions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<any>(null);
  const { conditions, loading, error, fetchConditions } = useCommercialConditions();
  
  const openCreateDialog = () => {
    setEditingCondition(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (condition: any) => {
    setEditingCondition(condition);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCondition(null);
  };

  const handleSuccess = () => {
    fetchConditions();
    handleDialogClose();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tag className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Condições Comerciais</h1>
        </div>
        
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Condição Comercial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Condições Comerciais</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Erro ao carregar condições comerciais. Por favor, tente novamente.</p>
            </div>
          ) : conditions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma condição comercial encontrada. Crie sua primeira condição comercial.</p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Condição Comercial
              </Button>
            </div>
          ) : (
            <CommercialConditionsList 
              conditions={conditions} 
              isLoading={loading} 
              onDelete={fetchConditions}
              onToggle={fetchConditions}
              onEdit={openEditDialog}
            />
          )}
        </CardContent>
      </Card>

      <CommercialConditionDialog
        open={isDialogOpen}
        onSuccess={handleSuccess}
        onCancel={handleDialogClose}
        condition={editingCondition}
      />
    </div>
  );
};

export default CommercialConditions;
