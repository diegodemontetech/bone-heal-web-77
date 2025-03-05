
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash, Save, X } from "lucide-react";

interface ShippingRate {
  id: string;
  state: string;
  service_type: string;
  rate: number;
  delivery_days: number;
}

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const serviceTypes = [
  { value: 'PAC', label: 'Convencional' },
  { value: 'SEDEX', label: 'Express' }
];

const ShippingRatesTable = () => {
  const [newState, setNewState] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newDeliveryDays, setNewDeliveryDays] = useState("");
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [editRate, setEditRate] = useState("");
  const [editDeliveryDays, setEditDeliveryDays] = useState("");

  const queryClient = useQueryClient();

  const { data: shippingRates, isLoading } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("state", { ascending: true })
        .order("service_type", { ascending: true });

      if (error) throw error;
      return data as ShippingRate[];
    },
  });

  const addRateMutation = useMutation({
    mutationFn: async (newRate: Omit<ShippingRate, "id">) => {
      const { error } = await supabase
        .from("shipping_rates")
        .upsert([newRate], {
          onConflict: 'state,service_type'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Taxa de frete atualizada com sucesso!");
      setNewState("");
      setNewServiceType("");
      setNewRate("");
      setNewDeliveryDays("");
    },
    onError: (error) => {
      console.error("Erro ao adicionar taxa:", error);
      toast.error("Erro ao atualizar taxa de frete");
    },
  });

  const updateRateMutation = useMutation({
    mutationFn: async (rate: ShippingRate) => {
      const { error } = await supabase
        .from("shipping_rates")
        .update({
          rate: rate.rate,
          delivery_days: rate.delivery_days
        })
        .eq('id', rate.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Taxa de frete atualizada com sucesso!");
      setEditingRate(null);
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

  const handleAddRate = async () => {
    if (!newState || !newServiceType || !newRate || !newDeliveryDays) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const rate = parseFloat(newRate);
    const deliveryDays = parseInt(newDeliveryDays);

    if (isNaN(rate) || isNaN(deliveryDays)) {
      toast.error("Valores inválidos");
      return;
    }

    addRateMutation.mutate({
      state: newState,
      service_type: newServiceType,
      rate,
      delivery_days: deliveryDays
    });
  };

  const handleEditClick = (rate: ShippingRate) => {
    setEditingRate(rate);
    setEditRate(rate.rate.toString());
    setEditDeliveryDays(rate.delivery_days.toString());
  };

  const handleSaveEdit = () => {
    if (!editingRate) return;

    const rate = parseFloat(editRate);
    const deliveryDays = parseInt(editDeliveryDays);

    if (isNaN(rate) || isNaN(deliveryDays)) {
      toast.error("Valores inválidos");
      return;
    }

    updateRateMutation.mutate({
      ...editingRate,
      rate,
      delivery_days: deliveryDays
    });
  };

  const handleCancelEdit = () => {
    setEditingRate(null);
  };

  const handleDeleteRate = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta taxa de frete?")) {
      deleteRateMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Formulário para adicionar nova taxa */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select value={newState} onValueChange={setNewState}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service_type">Tipo de Serviço</Label>
              <Select value={newServiceType} onValueChange={setNewServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Valor (R$)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_days">Prazo (dias)</Label>
              <Input
                id="delivery_days"
                type="number"
                value={newDeliveryDays}
                onChange={(e) => setNewDeliveryDays(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          <Button 
            onClick={handleAddRate}
            disabled={addRateMutation.isPending || !newState || !newServiceType || !newRate || !newDeliveryDays}
          >
            {addRateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Adicionar Taxa
          </Button>

          {/* Tabela de taxas */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingRates?.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>{rate.state}</TableCell>
                  <TableCell>
                    {serviceTypes.find(t => t.value === rate.service_type)?.label || rate.service_type}
                  </TableCell>
                  
                  {editingRate?.id === rate.id ? (
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
                          onClick={() => handleEditClick(rate)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteRate(rate.id)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingRatesTable;
