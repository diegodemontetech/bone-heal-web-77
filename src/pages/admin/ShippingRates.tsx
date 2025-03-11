
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Trash, Edit, MapPin, Upload, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShippingRate } from "@/types/shipping";

const ShippingRates = () => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRate, setCurrentRate] = useState<ShippingRate | null>(null);
  const [formData, setFormData] = useState({
    region: "",
    zip_code_start: "",
    zip_code_end: "",
    flat_rate: "",
    additional_kg_rate: "",
    estimated_days: "",
    is_active: true
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("region", { ascending: true })
        .order("zip_code_start", { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error("Erro ao buscar taxas de envio:", error);
      toast.error("Erro ao carregar taxas de envio");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      region: "",
      zip_code_start: "",
      zip_code_end: "",
      flat_rate: "",
      additional_kg_rate: "",
      estimated_days: "",
      is_active: true
    });
    setIsEditing(false);
    setCurrentRate(null);
  };

  const openEditDialog = (rate: ShippingRate) => {
    setCurrentRate(rate);
    setFormData({
      region: rate.region,
      zip_code_start: rate.zip_code_start,
      zip_code_end: rate.zip_code_end,
      flat_rate: rate.flat_rate.toString(),
      additional_kg_rate: rate.additional_kg_rate.toString(),
      estimated_days: rate.estimated_days.toString(),
      is_active: rate.is_active
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreateRate = async () => {
    try {
      if (!formData.region || !formData.zip_code_start || !formData.zip_code_end || !formData.flat_rate) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      const rateData = {
        region: formData.region,
        zip_code_start: formData.zip_code_start,
        zip_code_end: formData.zip_code_end,
        flat_rate: Number(formData.flat_rate),
        additional_kg_rate: Number(formData.additional_kg_rate) || 0,
        estimated_days: Number(formData.estimated_days) || 5,
        is_active: formData.is_active
      };

      if (isEditing && currentRate) {
        // Atualizar taxa existente
        const { error } = await supabase
          .from("shipping_rates")
          .update(rateData)
          .eq("id", currentRate.id);

        if (error) throw error;
        toast.success("Taxa de envio atualizada com sucesso!");
      } else {
        // Criar nova taxa
        const { error } = await supabase
          .from("shipping_rates")
          .insert([rateData]);

        if (error) throw error;
        toast.success("Taxa de envio criada com sucesso!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRates();
    } catch (error: any) {
      console.error("Erro ao salvar taxa de envio:", error);
      toast.error(`Erro ao salvar taxa de envio: ${error.message}`);
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta taxa de envio?")) return;

    try {
      const { error } = await supabase
        .from("shipping_rates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Taxa de envio excluída com sucesso!");
      fetchRates();
    } catch (error: any) {
      console.error("Erro ao excluir taxa de envio:", error);
      toast.error(`Erro ao excluir taxa de envio: ${error.message}`);
    }
  };

  const exportRates = () => {
    try {
      const dataStr = JSON.stringify(rates, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'shipping-rates.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success("Taxas de envio exportadas com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar taxas:", error);
      toast.error("Erro ao exportar taxas de envio");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Taxas de Envio</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportRates}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Taxa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Editar Taxa de Envio" : "Criar Nova Taxa de Envio"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Região</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => handleSelectChange("region", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sudeste">Sudeste</SelectItem>
                      <SelectItem value="Sul">Sul</SelectItem>
                      <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                      <SelectItem value="Nordeste">Nordeste</SelectItem>
                      <SelectItem value="Norte">Norte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip_code_start">CEP Inicial</Label>
                    <Input
                      id="zip_code_start"
                      name="zip_code_start"
                      value={formData.zip_code_start}
                      onChange={handleInputChange}
                      placeholder="Ex: 01000000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip_code_end">CEP Final</Label>
                    <Input
                      id="zip_code_end"
                      name="zip_code_end"
                      value={formData.zip_code_end}
                      onChange={handleInputChange}
                      placeholder="Ex: 09999999"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flat_rate">Taxa Base (R$)</Label>
                    <Input
                      id="flat_rate"
                      name="flat_rate"
                      type="number"
                      value={formData.flat_rate}
                      onChange={handleInputChange}
                      placeholder="Ex: 15.90"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additional_kg_rate">Taxa por Kg Adicional (R$)</Label>
                    <Input
                      id="additional_kg_rate"
                      name="additional_kg_rate"
                      type="number"
                      value={formData.additional_kg_rate}
                      onChange={handleInputChange}
                      placeholder="Ex: 2.50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimated_days">Prazo Estimado (dias)</Label>
                  <Input
                    id="estimated_days"
                    name="estimated_days"
                    type="number"
                    value={formData.estimated_days}
                    onChange={handleInputChange}
                    placeholder="Ex: 5"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_active">Taxa Ativa</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateRate}>
                    {isEditing ? "Atualizar" : "Criar"} Taxa
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Taxas de Envio</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : rates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma taxa de envio encontrada. Configure sua primeira taxa.</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Configurar Taxa
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Região</TableHead>
                  <TableHead>Faixa de CEP</TableHead>
                  <TableHead>Taxa Base</TableHead>
                  <TableHead>Kg Adicional</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell className="font-medium">{rate.region}</TableCell>
                    <TableCell>
                      {rate.zip_code_start?.substring(0, 5)}-{rate.zip_code_start?.substring(5)} a {rate.zip_code_end?.substring(0, 5)}-{rate.zip_code_end?.substring(5)}
                    </TableCell>
                    <TableCell>R$ {Number(rate.flat_rate).toFixed(2)}</TableCell>
                    <TableCell>R$ {Number(rate.additional_kg_rate).toFixed(2)}</TableCell>
                    <TableCell>{rate.estimated_days} dias</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rate.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rate.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openEditDialog(rate)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteRate(rate.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingRates;
