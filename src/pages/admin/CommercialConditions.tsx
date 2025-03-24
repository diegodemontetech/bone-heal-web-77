
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { useCommercialConditions } from "@/hooks/admin/use-commercial-conditions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const CommercialConditions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<any>(null);
  const { conditions, loading, error } = useCommercialConditions();
  
  const openCreateDialog = () => {
    setEditingCondition(null);
    setIsDialogOpen(true);
    toast.info("Funcionalidade em desenvolvimento");
  };

  const openEditDialog = (condition: any) => {
    setEditingCondition(condition);
    setIsDialogOpen(true);
    toast.info("Funcionalidade em desenvolvimento");
  };

  const formatDiscountType = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Percentual';
      case 'fixed':
        return 'Valor Fixo';
      case 'shipping':
        return 'Frete Grátis';
      default:
        return type;
    }
  };

  const formatDiscount = (condition: any) => {
    if (condition.discount_type === 'percentage') {
      return `${condition.discount_value}%`;
    } else if (condition.discount_type === 'fixed') {
      return `R$ ${condition.discount_value.toFixed(2)}`;
    } else if (condition.discount_type === 'shipping' || condition.free_shipping) {
      return 'Frete Grátis';
    }
    return `${condition.discount_value}`;
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Nome</th>
                    <th className="px-4 py-2 text-left">Tipo</th>
                    <th className="px-4 py-2 text-left">Desconto</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {conditions.map((condition) => (
                    <tr key={condition.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3">{condition.name}</td>
                      <td className="px-4 py-3">{formatDiscountType(condition.discount_type)}</td>
                      <td className="px-4 py-3">{formatDiscount(condition)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${condition.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {condition.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(condition)}>
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for creating/editing condition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCondition ? 'Editar Condição Comercial' : 'Nova Condição Comercial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Esta funcionalidade está em desenvolvimento. Por favor, utilize o componente completo na próxima versão.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                {editingCondition ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommercialConditions;
