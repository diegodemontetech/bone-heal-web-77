import { useState, useEffect } from "react";
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
import { Loader2, Plus, Pencil, Trash, Save, X, FileUp } from "lucide-react";

interface ShippingRate {
  id: string;
  state: string;
  service_type: string;
  region_type: string;
  rate: number;
  delivery_days: number;
}

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const serviceTypes = [
  { value: 'PAC', label: 'PAC (Convencional)' },
  { value: 'SEDEX', label: 'SEDEX (Express)' }
];

const regionTypes = [
  { value: 'Capital', label: 'Capital' },
  { value: 'Interior', label: 'Interior' }
];

const ShippingRatesTable = () => {
  const [newState, setNewState] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [newRegionType, setNewRegionType] = useState("Capital");
  const [newRate, setNewRate] = useState("");
  const [newDeliveryDays, setNewDeliveryDays] = useState("");
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [editRate, setEditRate] = useState("");
  const [editDeliveryDays, setEditDeliveryDays] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const queryClient = useQueryClient();

  const { data: shippingRates, isLoading } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("state", { ascending: true })
        .order("region_type", { ascending: true })
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
          onConflict: 'state,service_type,region_type'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Taxa de frete atualizada com sucesso!");
      setNewState("");
      setNewServiceType("");
      setNewRegionType("Capital");
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
    if (!newState || !newServiceType || !newRegionType || !newRate || !newDeliveryDays) {
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
      region_type: newRegionType,
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

  const importDefaultRates = async () => {
    setIsImporting(true);
    
    try {
      // Lista de taxas de frete padrão conforme fornecido pelo usuário
      const defaultRates = [
        { state: 'AC', region_type: 'Capital', service_type: 'PAC', delivery_days: 10, rate: 100 },
        { state: 'AC', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 5, rate: 150 },
        { state: 'AC', region_type: 'Interior', service_type: 'PAC', delivery_days: 12, rate: 120 },
        { state: 'AC', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 7, rate: 180 },
        { state: 'AL', region_type: 'Capital', service_type: 'PAC', delivery_days: 6, rate: 50 },
        { state: 'AL', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 75 },
        { state: 'AL', region_type: 'Interior', service_type: 'PAC', delivery_days: 7, rate: 55 },
        { state: 'AL', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 80 },
        { state: 'AP', region_type: 'Capital', service_type: 'PAC', delivery_days: 10, rate: 90 },
        { state: 'AP', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'AP', region_type: 'Interior', service_type: 'PAC', delivery_days: 12, rate: 100 },
        { state: 'AP', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 6, rate: 130 },
        { state: 'AM', region_type: 'Capital', service_type: 'PAC', delivery_days: 9, rate: 80 },
        { state: 'AM', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 130 },
        { state: 'AM', region_type: 'Interior', service_type: 'PAC', delivery_days: 11, rate: 90 },
        { state: 'AM', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 150 },
        { state: 'BA', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 45 },
        { state: 'BA', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 70 },
        { state: 'BA', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 50 },
        { state: 'BA', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 85 },
        { state: 'CE', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 60 },
        { state: 'CE', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 100 },
        { state: 'CE', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'CE', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 110 },
        { state: 'DF', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 35 },
        { state: 'DF', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 45 },
        { state: 'DF', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 40 },
        { state: 'DF', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 55 },
        { state: 'ES', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 25 },
        { state: 'ES', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 40 },
        { state: 'ES', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 30 },
        { state: 'ES', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 50 },
        { state: 'GO', region_type: 'Capital', service_type: 'PAC', delivery_days: 5, rate: 35 },
        { state: 'GO', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 60 },
        { state: 'GO', region_type: 'Interior', service_type: 'PAC', delivery_days: 6, rate: 40 },
        { state: 'GO', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 65 },
        { state: 'MA', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 70 },
        { state: 'MA', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 110 },
        { state: 'MA', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 80 },
        { state: 'MA', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 120 },
        { state: 'MT', region_type: 'Capital', service_type: 'PAC', delivery_days: 6, rate: 65 },
        { state: 'MT', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 85 },
        { state: 'MT', region_type: 'Interior', service_type: 'PAC', delivery_days: 7, rate: 70 },
        { state: 'MT', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'MS', region_type: 'Capital', service_type: 'PAC', delivery_days: 5, rate: 45 },
        { state: 'MS', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 70 },
        { state: 'MS', region_type: 'Interior', service_type: 'PAC', delivery_days: 6, rate: 50 },
        { state: 'MS', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 80 },
        { state: 'MG', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 25 },
        { state: 'MG', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 1, rate: 35 },
        { state: 'MG', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 30 },
        { state: 'MG', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 2, rate: 45 },
        { state: 'PA', region_type: 'Capital', service_type: 'PAC', delivery_days: 9, rate: 85 },
        { state: 'PA', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 130 },
        { state: 'PA', region_type: 'Interior', service_type: 'PAC', delivery_days: 10, rate: 95 },
        { state: 'PA', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'PB', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'PB', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'PB', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 70 },
        { state: 'PB', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 100 },
        { state: 'PR', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 30 },
        { state: 'PR', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 50 },
        { state: 'PR', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 35 },
        { state: 'PR', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 60 },
        { state: 'PE', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 60 },
        { state: 'PE', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 90 },
        { state: 'PE', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'PE', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'PI', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 70 },
        { state: 'PI', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 110 },
        { state: 'PI', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 75 },
        { state: 'PI', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 120 },
        { state: 'RJ', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 25 },
        { state: 'RJ', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 1, rate: 35 },
        { state: 'RJ', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 30 },
        { state: 'RJ', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 2, rate: 45 },
        { state: 'RN', region_type: 'Capital', service_type: 'PAC', delivery_days: 8, rate: 65 },
        { state: 'RN', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 95 },
        { state: 'RN', region_type: 'Interior', service_type: 'PAC', delivery_days: 9, rate: 70 },
        { state: 'RN', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 100 },
        { state: 'RS', region_type: 'Capital', service_type: 'PAC', delivery_days: 5, rate: 45 },
        { state: 'RS', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 70 },
        { state: 'RS', region_type: 'Interior', service_type: 'PAC', delivery_days: 6, rate: 50 },
        { state: 'RS', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 80 },
        { state: 'RO', region_type: 'Capital', service_type: 'PAC', delivery_days: 9, rate: 85 },
        { state: 'RO', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 4, rate: 130 },
        { state: 'RO', region_type: 'Interior', service_type: 'PAC', delivery_days: 10, rate: 95 },
        { state: 'RO', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'RR', region_type: 'Capital', service_type: 'PAC', delivery_days: 10, rate: 90 },
        { state: 'RR', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 5, rate: 140 },
        { state: 'RR', region_type: 'Interior', service_type: 'PAC', delivery_days: 12, rate: 100 },
        { state: 'RR', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 6, rate: 150 },
        { state: 'SC', region_type: 'Capital', service_type: 'PAC', delivery_days: 4, rate: 35 },
        { state: 'SC', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 2, rate: 60 },
        { state: 'SC', region_type: 'Interior', service_type: 'PAC', delivery_days: 5, rate: 40 },
        { state: 'SC', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 3, rate: 65 },
        { state: 'SP', region_type: 'Capital', service_type: 'PAC', delivery_days: 3, rate: 20 },
        { state: 'SP', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 1, rate: 22 },
        { state: 'SP', region_type: 'Interior', service_type: 'PAC', delivery_days: 4, rate: 20 },
        { state: 'SP', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 2, rate: 22 },
        { state: 'SE', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 55 },
        { state: 'SE', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 85 },
        { state: 'SE', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 60 },
        { state: 'SE', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 90 },
        { state: 'TO', region_type: 'Capital', service_type: 'PAC', delivery_days: 7, rate: 75 },
        { state: 'TO', region_type: 'Capital', service_type: 'SEDEX', delivery_days: 3, rate: 110 },
        { state: 'TO', region_type: 'Interior', service_type: 'PAC', delivery_days: 8, rate: 80 },
        { state: 'TO', region_type: 'Interior', service_type: 'SEDEX', delivery_days: 4, rate: 120 },
      ];
      
      // Inserir em lotes
      for (let i = 0; i < defaultRates.length; i += 20) {
        const batch = defaultRates.slice(i, i + 20);
        
        const { error } = await supabase
          .from("shipping_rates")
          .upsert(batch, {
            onConflict: 'state,service_type,region_type'
          });
        
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Tabela de fretes importada com sucesso!");
    } catch (error) {
      console.error("Erro ao importar taxas de frete:", error);
      toast.error("Erro ao importar taxas de frete");
    } finally {
      setIsImporting(false);
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
          {/* Botão para importar valores padrão */}
          <div className="flex justify-end">
            <Button 
              onClick={importDefaultRates}
              disabled={isImporting}
              variant="outline"
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileUp className="w-4 h-4 mr-2" />
              )}
              Importar Tabela Padrão
            </Button>
          </div>

          {/* Formulário para adicionar nova taxa */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <Label htmlFor="region_type">Região</Label>
              <Select value={newRegionType} onValueChange={setNewRegionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a região" />
                </SelectTrigger>
                <SelectContent>
                  {regionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
                <TableHead>Região</TableHead>
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
                  <TableCell>{rate.region_type}</TableCell>
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
