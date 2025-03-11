
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Plus, Trash, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Voucher {
  id: string;
  code: string;
  discount_percentage: number;
  discount_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  minimum_purchase: number | null;
  is_active: boolean;
  created_at: string;
}

const Vouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_percentage: 0,
    discount_amount: "",
    max_uses: "",
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: "",
    minimum_purchase: "",
    is_active: true
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
      toast.error("Erro ao carregar cupons de desconto");
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

  const resetForm = () => {
    setFormData({
      code: "",
      discount_percentage: 0,
      discount_amount: "",
      max_uses: "",
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: "",
      minimum_purchase: "",
      is_active: true
    });
    setIsEditing(false);
    setCurrentVoucher(null);
  };

  const openEditDialog = (voucher: Voucher) => {
    setCurrentVoucher(voucher);
    setFormData({
      code: voucher.code,
      discount_percentage: voucher.discount_percentage,
      discount_amount: voucher.discount_amount?.toString() || "",
      max_uses: voucher.max_uses?.toString() || "",
      valid_from: new Date(voucher.valid_from).toISOString().split('T')[0],
      valid_until: voucher.valid_until ? new Date(voucher.valid_until).toISOString().split('T')[0] : "",
      minimum_purchase: voucher.minimum_purchase?.toString() || "",
      is_active: voucher.is_active
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleCreateVoucher = async () => {
    try {
      if (!formData.code || (!formData.discount_percentage && !formData.discount_amount)) {
        toast.error("Por favor, preencha pelo menos o código e um tipo de desconto");
        return;
      }

      const voucherData = {
        code: formData.code,
        discount_percentage: Number(formData.discount_percentage),
        discount_amount: formData.discount_amount ? Number(formData.discount_amount) : null,
        max_uses: formData.max_uses ? Number(formData.max_uses) : null,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        minimum_purchase: formData.minimum_purchase ? Number(formData.minimum_purchase) : null,
        is_active: formData.is_active
      };

      if (isEditing && currentVoucher) {
        // Atualizar cupom existente
        const { error } = await supabase
          .from("vouchers")
          .update(voucherData)
          .eq("id", currentVoucher.id);

        if (error) throw error;
        toast.success("Cupom atualizado com sucesso!");
      } else {
        // Criar novo cupom
        const { error } = await supabase
          .from("vouchers")
          .insert([voucherData]);

        if (error) throw error;
        toast.success("Cupom criado com sucesso!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchVouchers();
    } catch (error: any) {
      console.error("Erro ao salvar cupom:", error);
      toast.error(`Erro ao salvar cupom: ${error.message}`);
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;

    try {
      const { error } = await supabase
        .from("vouchers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Cupom excluído com sucesso!");
      fetchVouchers();
    } catch (error: any) {
      console.error("Erro ao excluir cupom:", error);
      toast.error(`Erro ao excluir cupom: ${error.message}`);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Cupom" : "Criar Novo Cupom"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Cupom</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Ex: BONEHEAL20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Desconto (%)</Label>
                  <Input
                    id="discount_percentage"
                    name="discount_percentage"
                    type="number"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount_amount">Desconto (R$)</Label>
                  <Input
                    id="discount_amount"
                    name="discount_amount"
                    type="number"
                    value={formData.discount_amount}
                    onChange={handleInputChange}
                    placeholder="Ex: 50.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valid_from">Válido de</Label>
                  <Input
                    id="valid_from"
                    name="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valid_until">Válido até</Label>
                  <Input
                    id="valid_until"
                    name="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Máximo de Usos</Label>
                  <Input
                    id="max_uses"
                    name="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={handleInputChange}
                    placeholder="Ex: 100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimum_purchase">Compra Mínima (R$)</Label>
                  <Input
                    id="minimum_purchase"
                    name="minimum_purchase"
                    type="number"
                    value={formData.minimum_purchase}
                    onChange={handleInputChange}
                    placeholder="Ex: 200.00"
                  />
                </div>
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
                <Label htmlFor="is_active">Cupom Ativo</Label>
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
                <Button onClick={handleCreateVoucher}>
                  {isEditing ? "Atualizar" : "Criar"} Cupom
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Cupons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhum cupom encontrado. Crie seu primeiro cupom de desconto.</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Cupom
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-medium">{voucher.code}</TableCell>
                    <TableCell>
                      {voucher.discount_percentage > 0 && `${voucher.discount_percentage}%`}
                      {voucher.discount_amount && voucher.discount_percentage > 0 && ' ou '}
                      {voucher.discount_amount && `R$ ${voucher.discount_amount.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      {formatDate(voucher.valid_from)} 
                      {voucher.valid_until && ` até ${formatDate(voucher.valid_until)}`}
                    </TableCell>
                    <TableCell>
                      {voucher.current_uses} 
                      {voucher.max_uses && ` / ${voucher.max_uses}`}
                    </TableCell>
                    <TableCell>
                      {voucher.is_active ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openEditDialog(voucher)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteVoucher(voucher.id)}
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

export default Vouchers;
