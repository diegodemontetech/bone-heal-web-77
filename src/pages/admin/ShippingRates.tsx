import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const AdminShippingRates = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [formData, setFormData] = useState({
    state: "",
    rate: "",
  });
  const { toast } = useToast();

  const { data: rates, refetch } = useQuery({
    queryKey: ["admin-shipping-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("state", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rateValue = parseFloat(formData.rate);
    if (isNaN(rateValue)) {
      toast({
        title: "Erro",
        description: "O valor da taxa deve ser um número válido",
        variant: "destructive",
      });
      return;
    }

    const { error } = editingRate
      ? await supabase
          .from("shipping_rates")
          .update({ rate: rateValue })
          .eq("id", editingRate.id)
      : await supabase
          .from("shipping_rates")
          .insert([{ state: formData.state, rate: rateValue }]);

    if (error) {
      toast({
        title: "Erro ao salvar taxa",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: editingRate ? "Taxa atualizada" : "Taxa criada",
      description: editingRate
        ? "Taxa de frete atualizada com sucesso"
        : "Taxa de frete criada com sucesso",
    });
    setIsFormOpen(false);
    setEditingRate(null);
    setFormData({ state: "", rate: "" });
    refetch();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("shipping_rates")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir taxa",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Taxa excluída com sucesso",
    });
    refetch();
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Taxas de Frete</h1>
          <Button onClick={() => {
            setEditingRate(null);
            setFormData({ state: "", rate: "" });
            setIsFormOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Taxa
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Taxa (R$)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates?.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    {STATES.find((s) => s.value === rate.state)?.label || rate.state}
                  </TableCell>
                  <TableCell>R$ {rate.rate.toFixed(2)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingRate(rate);
                        setFormData({
                          state: rate.state,
                          rate: rate.rate.toString(),
                        });
                        setIsFormOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(rate.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRate ? "Editar Taxa de Frete" : "Nova Taxa de Frete"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="state">Estado</Label>
                {editingRate ? (
                  <Input
                    id="state"
                    value={STATES.find((s) => s.value === formData.state)?.label || formData.state}
                    disabled
                  />
                ) : (
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label htmlFor="rate">Taxa (R$)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingRate ? "Atualizar" : "Criar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminShippingRates;