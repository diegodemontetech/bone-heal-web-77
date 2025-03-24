
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Pencil, Save, Trash, X } from "lucide-react";
import { ShippingRate } from "./types";
import { serviceTypes } from "./types";

interface ShippingRateRowProps {
  rate: ShippingRate;
}

export const ShippingRateRow = ({ rate }: ShippingRateRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editRate, setEditRate] = useState(rate.rate.toString());
  const [editDeliveryDays, setEditDeliveryDays] = useState(rate.delivery_days.toString());
  
  const queryClient = useQueryClient();

  const updateRateMutation = useMutation({
    mutationFn: async (updatedRate: ShippingRate) => {
      const { error } = await supabase
        .from("shipping_rates")
        .update({
          rate: updatedRate.rate,
          delivery_days: updatedRate.delivery_days
        })
        .eq('id', updatedRate.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Taxa de frete atualizada com sucesso!");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Erro ao atualizar taxa:", error);
      toast.error("Erro ao atualizar taxa de frete");
    },
  });

  const deleteRateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("shipping_rates")
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Taxa de frete removida com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao remover taxa:", error);
      toast.error("Erro ao remover taxa de frete");
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditRate(rate.rate.toString());
    setEditDeliveryDays(rate.delivery_days.toString());
  };

  const handleSaveEdit = () => {
    const rateValue = parseFloat(editRate);
    const deliveryDays = parseInt(editDeliveryDays);

    if (isNaN(rateValue) || isNaN(deliveryDays)) {
      toast.error("Valores inválidos");
      return;
    }

    updateRateMutation.mutate({
      ...rate,
      rate: rateValue,
      delivery_days: deliveryDays
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteRate = () => {
    if (window.confirm("Tem certeza que deseja remover esta taxa de frete?")) {
      deleteRateMutation.mutate(rate.id);
    }
  };

  return (
    <TableRow>
      <TableCell>{rate.state}</TableCell>
      <TableCell>{rate.region_type}</TableCell>
      <TableCell>
        {serviceTypes.find(t => t.value === rate.service_type)?.label || rate.service_type}
      </TableCell>
      
      {isEditing ? (
        <>
          <TableCell>
            <Input
              type="number"
              step="0.01"
              value={editRate}
              onChange={(e) => setEditRate(e.target.value)}
              className="w-24"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              value={editDeliveryDays}
              onChange={(e) => setEditDeliveryDays(e.target.value)}
              className="w-16"
            />
          </TableCell>
          <TableCell className="text-right space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSaveEdit}
              disabled={updateRateMutation.isPending}
            >
              {updateRateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleCancelEdit}
            >
              <X className="w-4 h-4" />
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>R$ {rate.rate.toFixed(2)}</TableCell>
          <TableCell>{rate.delivery_days} dias</TableCell>
          <TableCell className="text-right space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleEditClick}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleDeleteRate}
              disabled={deleteRateMutation.isPending}
            >
              {deleteRateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash className="w-4 h-4" />
              )}
            </Button>
          </TableCell>
        </>
      )}
    </TableRow>
  );
};
