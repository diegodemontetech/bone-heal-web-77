import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Pencil, Save, X } from "lucide-react";

interface ShippingRate {
  id: string;
  state: string;
  rate: number;
  price_per_kg: number;
  additional_kg_price: number;
  insurance_percentage: number;
  delivery_days: number;
  service_type: "PAC" | "SEDEX";
}

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const ShippingRatesTable = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRate, setEditingRate] = useState<string>("");
  const [editingPricePerKg, setEditingPricePerKg] = useState<string>("");
  const [editingAdditionalKgPrice, setEditingAdditionalKgPrice] = useState<string>("");
  const [editingInsurancePercentage, setEditingInsurancePercentage] = useState<string>("");
  const [editingDeliveryDays, setEditingDeliveryDays] = useState<string>("");
  const [editingServiceType, setEditingServiceType] = useState<"PAC" | "SEDEX">("PAC");
  const { toast } = useToast();

  const { data: rates, refetch, isLoading } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("state");
      
      if (error) throw error;
      return data as ShippingRate[];
    },
  });

  const handleEdit = (rate: ShippingRate) => {
    setEditingId(rate.id);
    setEditingRate(rate.rate.toString());
    setEditingPricePerKg(rate.price_per_kg.toString());
    setEditingAdditionalKgPrice(rate.additional_kg_price.toString());
    setEditingInsurancePercentage(rate.insurance_percentage.toString());
    setEditingDeliveryDays(rate.delivery_days.toString());
    setEditingServiceType(rate.service_type);
  };

  const handleSave = async (id: string, state: string) => {
    try {
      const numericRate = parseFloat(editingRate);
      const numericPricePerKg = parseFloat(editingPricePerKg);
      const numericAdditionalKgPrice = parseFloat(editingAdditionalKgPrice);
      const numericInsurancePercentage = parseFloat(editingInsurancePercentage);
      const numericDeliveryDays = parseInt(editingDeliveryDays);

      if (isNaN(numericRate) || isNaN(numericPricePerKg) || 
          isNaN(numericAdditionalKgPrice) || isNaN(numericInsurancePercentage) || 
          isNaN(numericDeliveryDays)) {
        throw new Error("Valores inválidos");
      }

      const { error } = await supabase
        .from("shipping_rates")
        .upsert({
          id: id === "new" ? undefined : id,
          state,
          rate: numericRate,
          price_per_kg: numericPricePerKg,
          additional_kg_price: numericAdditionalKgPrice,
          insurance_percentage: numericInsurancePercentage,
          delivery_days: numericDeliveryDays,
          service_type: editingServiceType,
        });

      if (error) throw error;

      toast({
        title: "Taxa atualizada com sucesso",
      });

      handleCancel();
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar taxa",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingRate("");
    setEditingPricePerKg("");
    setEditingAdditionalKgPrice("");
    setEditingInsurancePercentage("");
    setEditingDeliveryDays("");
    setEditingServiceType("PAC");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Create a map of existing rates
  const ratesMap = new Map(rates?.map(rate => [rate.state, rate]));

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
            <TableHead>Taxa Base (R$)</TableHead>
            <TableHead>Preço/Kg (R$)</TableHead>
            <TableHead>Kg Adicional (R$)</TableHead>
            <TableHead>Seguro (%)</TableHead>
            <TableHead>Dias Entrega</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {STATES.map((state) => {
            const rate = ratesMap.get(state);
            const isEditing = editingId === (rate?.id || "new");

            return (
              <TableRow key={state}>
                <TableCell>{state}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editingRate}
                      onChange={(e) => setEditingRate(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  ) : (
                    rate ? `R$ ${rate.rate.toFixed(2)}` : "-"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editingPricePerKg}
                      onChange={(e) => setEditingPricePerKg(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  ) : (
                    rate ? `R$ ${rate.price_per_kg.toFixed(2)}` : "-"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editingAdditionalKgPrice}
                      onChange={(e) => setEditingAdditionalKgPrice(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  ) : (
                    rate ? `R$ ${rate.additional_kg_price.toFixed(2)}` : "-"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editingInsurancePercentage}
                      onChange={(e) => setEditingInsurancePercentage(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  ) : (
                    rate ? `${rate.insurance_percentage.toFixed(2)}%` : "-"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editingDeliveryDays}
                      onChange={(e) => setEditingDeliveryDays(e.target.value)}
                      min="0"
                    />
                  ) : (
                    rate ? rate.delivery_days : "-"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editingServiceType}
                      onValueChange={(value: "PAC" | "SEDEX") => setEditingServiceType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PAC">PAC</SelectItem>
                        <SelectItem value="SEDEX">SEDEX</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    rate ? rate.service_type : "-"
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(rate?.id || "new", state)}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (rate) {
                          handleEdit(rate);
                        } else {
                          setEditingId("new");
                          setEditingRate("0");
                          setEditingPricePerKg("0");
                          setEditingAdditionalKgPrice("0");
                          setEditingInsurancePercentage("0");
                          setEditingDeliveryDays("0");
                          setEditingServiceType("PAC");
                        }
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShippingRatesTable;