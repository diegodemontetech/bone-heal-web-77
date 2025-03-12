import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCommercialConditions } from "@/hooks/admin/use-commercial-conditions";
import { CommercialConditionForm } from "@/components/admin/commercial-conditions/CommercialConditionForm";
import { CommercialConditionsTable } from "@/components/admin/commercial-conditions/CommercialConditionsTable";
import { CommercialConditionsEmptyState } from "@/components/admin/commercial-conditions/CommercialConditionsEmptyState";

interface CommercialCondition {
  id: string;
  created_at: string;
  customer_group: string;
  description: string;
  discount_type: string;
  discount_value: number;
  free_shipping: boolean;
  is_active: boolean;
  min_amount: number;
  valid_until: string;
  min_purchase_value: number;
  min_purchase_quantity: number;
  target_customer_group: string;
  valid_from: string;
}

const CommercialConditions = () => {
  const {
    conditions,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateCondition,
    handleDeleteCondition,
  } = useCommercialConditions();

  const [localConditions, setConditions] = useState<CommercialCondition[]>([]);

  useEffect(() => {
    if (conditions) {
      setConditions(conditions.map(condition => ({
        ...condition,
        min_purchase_value: condition.min_amount || 0,
        min_purchase_quantity: condition.min_items || 0,
        target_customer_group: condition.customer_group || 'all',
        valid_from: condition.created_at
      })));
    }
  }, [conditions]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Condições Comerciais</h1>
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Condição
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
          ) : localConditions.length === 0 ? (
            <CommercialConditionsEmptyState onAddCondition={() => setIsDialogOpen(true)} />
          ) : (
            <CommercialConditionsTable
              conditions={localConditions}
              onEdit={openEditDialog}
              onDelete={handleDeleteCondition}
            />
          )}
        </CardContent>
      </Card>

      <CommercialConditionForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        isEditing={isEditing}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleCreateCondition={handleCreateCondition}
        resetForm={resetForm}
      />
    </div>
  );
};

export default CommercialConditions;
