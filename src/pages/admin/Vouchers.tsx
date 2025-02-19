
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VoucherForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    valid_until: "",
    max_uses: "",
    min_amount: "",
    min_items: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('vouchers')
        .insert([{
          ...formData,
          code: formData.code.toUpperCase(),
          discount_value: Number(formData.discount_value),
          max_uses: formData.max_uses ? Number(formData.max_uses) : null,
          min_amount: formData.min_amount ? Number(formData.min_amount) : null,
          min_items: formData.min_items ? Number(formData.min_items) : null,
        }]);

      if (error) throw error;

      toast.success("Cupom criado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      toast.error("Erro ao criar cupom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Código do Cupom</Label>
        <Input
          id="code"
          required
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount_type">Tipo de Desconto</Label>
        <Select
          value={formData.discount_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentual</SelectItem>
            <SelectItem value="fixed">Valor Fixo</SelectItem>
            <SelectItem value="shipping">Frete Grátis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount_value">Valor do Desconto</Label>
        <Input
          id="discount_value"
          type="number"
          required
          value={formData.discount_value}
          onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valid_until">Válido até</Label>
        <Input
          id="valid_until"
          type="datetime-local"
          value={formData.valid_until}
          onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_uses">Limite de Usos</Label>
        <Input
          id="max_uses"
          type="number"
          value={formData.max_uses}
          onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_amount">Valor Mínimo da Compra</Label>
        <Input
          id="min_amount"
          type="number"
          value={formData.min_amount}
          onChange={(e) => setFormData(prev => ({ ...prev, min_amount: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_items">Quantidade Mínima de Itens</Label>
        <Input
          id="min_items"
          type="number"
          value={formData.min_items}
          onChange={(e) => setFormData(prev => ({ ...prev, min_items: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Cupom"}
      </Button>
    </form>
  );
};

const AdminVouchers = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: vouchers, isLoading, refetch } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Cupom excluído com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir cupom");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cupom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Cupom</DialogTitle>
              </DialogHeader>
              <VoucherForm onSuccess={() => {
                setIsFormOpen(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Válido até</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : vouchers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum cupom encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  vouchers?.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell>{voucher.code}</TableCell>
                      <TableCell>
                        {voucher.discount_type === 'percentage' ? 'Percentual' :
                         voucher.discount_type === 'fixed' ? 'Valor Fixo' : 'Frete Grátis'}
                      </TableCell>
                      <TableCell>
                        {voucher.discount_type === 'percentage' ? `${voucher.discount_value}%` :
                         voucher.discount_type === 'fixed' ? `R$ ${voucher.discount_value}` : 'Grátis'}
                      </TableCell>
                      <TableCell>
                        {voucher.valid_until ? new Date(voucher.valid_until).toLocaleDateString() : 'Sem limite'}
                      </TableCell>
                      <TableCell>
                        {voucher.current_uses}/{voucher.max_uses || '∞'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(voucher.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVouchers;
