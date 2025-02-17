
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface ShippingConfig {
  id: string;
  carrier: string;
  omie_carrier_code?: string;
  omie_service_code?: string;
  active: boolean;
  settings: Record<string, any>;
}

const ShippingRatesTable = () => {
  const [newCarrier, setNewCarrier] = useState("");
  const [newOmieCarrierCode, setNewOmieCarrierCode] = useState("");
  const [newOmieServiceCode, setNewOmieServiceCode] = useState("");

  const { data: shippingConfigs, isLoading, refetch } = useQuery({
    queryKey: ["shipping-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_configs")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ShippingConfig[];
    },
  });

  const handleAddCarrier = async () => {
    try {
      const { error } = await supabase.from("shipping_configs").insert({
        carrier: newCarrier,
        omie_carrier_code: newOmieCarrierCode,
        omie_service_code: newOmieServiceCode,
      });

      if (error) throw error;

      toast.success("Transportadora adicionada com sucesso!");
      setNewCarrier("");
      setNewOmieCarrierCode("");
      setNewOmieServiceCode("");
      refetch();
    } catch (error) {
      console.error("Erro ao adicionar transportadora:", error);
      toast.error("Erro ao adicionar transportadora");
    }
  };

  const toggleCarrierStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("shipping_configs")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Status atualizado com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
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
          {/* Formulário para adicionar nova transportadora */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Nome da Transportadora</Label>
              <Input
                id="carrier"
                value={newCarrier}
                onChange={(e) => setNewCarrier(e.target.value)}
                placeholder="Ex: Correios"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="omie_code">Código Omie</Label>
              <Input
                id="omie_code"
                value={newOmieCarrierCode}
                onChange={(e) => setNewOmieCarrierCode(e.target.value)}
                placeholder="Ex: COR"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_code">Código do Serviço</Label>
              <Input
                id="service_code"
                value={newOmieServiceCode}
                onChange={(e) => setNewOmieServiceCode(e.target.value)}
                placeholder="Ex: PAC"
              />
            </div>
          </div>
          <Button onClick={handleAddCarrier} disabled={!newCarrier}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Transportadora
          </Button>

          {/* Tabela de transportadoras */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transportadora</TableHead>
                <TableHead>Código Omie</TableHead>
                <TableHead>Código do Serviço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingConfigs?.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{config.carrier}</TableCell>
                  <TableCell>{config.omie_carrier_code || "-"}</TableCell>
                  <TableCell>{config.omie_service_code || "-"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={config.active}
                      onCheckedChange={() => toggleCarrierStatus(config.id, config.active)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Sincronizar com Omie
                        toast.info("Em desenvolvimento");
                      }}
                    >
                      Sincronizar
                    </Button>
                  </TableCell>
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
