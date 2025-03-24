
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { brazilianStates, regionTypes, serviceTypes } from "./types";

interface AddRateFormProps {
  onSuccess?: () => void;
}

export const AddRateForm = ({ onSuccess }: AddRateFormProps) => {
  const [newState, setNewState] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [newRegionType, setNewRegionType] = useState("Capital");
  const [newRate, setNewRate] = useState("");
  const [newDeliveryDays, setNewDeliveryDays] = useState("");
  
  const queryClient = useQueryClient();

  const addRateMutation = useMutation({
    mutationFn: async (newRate: {
      state: string;
      service_type: string;
      region_type: string;
      rate: number;
      delivery_days: number;
    }) => {
      const { data, error } = await supabase
        .from("shipping_rates")
        .upsert([newRate], {
          onConflict: 'state,service_type,region_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      toast.success("Taxa de frete adicionada com sucesso!");
      setNewState("");
      setNewServiceType("");
      setNewRegionType("Capital");
      setNewRate("");
      setNewDeliveryDays("");
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Erro ao adicionar taxa:", error);
      toast.error("Erro ao adicionar taxa de frete");
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

  return (
    <div className="space-y-6">
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
    </div>
  );
};
