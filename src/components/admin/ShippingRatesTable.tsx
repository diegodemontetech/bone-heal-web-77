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
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Pencil, Save, X } from "lucide-react";

interface ShippingRate {
  id: string;
  state: string;
  rate: number;
}

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const ShippingRatesTable = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRate, setEditingRate] = useState<string>("");
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
  };

  const handleSave = async (id: string, state: string) => {
    try {
      const numericRate = parseFloat(editingRate);
      if (isNaN(numericRate)) {
        throw new Error("Taxa inválida");
      }

      const { error } = await supabase
        .from("shipping_rates")
        .upsert({ 
          id: id || undefined,
          state,
          rate: numericRate,
        });

      if (error) throw error;

      toast({
        title: "Taxa atualizada com sucesso",
      });

      setEditingId(null);
      setEditingRate("");
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
            <TableHead>Taxa (R$)</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {STATES.map((state) => {
            const rate = ratesMap.get(state);
            const isEditing = rate && editingId === rate.id;

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
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(rate.id, state)}
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
                          setEditingRate("");
                          handleSave("new", state);
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