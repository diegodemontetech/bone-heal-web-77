import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoucherDialog } from "@/components/admin/vouchers/VoucherDialog";
import { VouchersList } from "@/components/admin/vouchers/VouchersList";
import { Voucher } from "@/types/voucher";
import { Trash, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    return new Date(dateStr).toLocaleDateString('pt-BR');
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        </div>
        
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
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
            <VouchersList 
              vouchers={vouchers}
              onEdit={openEditDialog}
              onDelete={handleDeleteVoucher}
              formatDate={formatDate}
            />
          )}
        </CardContent>
      </Card>

      <VoucherDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        isEditing={isEditing}
        currentVoucher={currentVoucher}
        onSubmit={handleCreateVoucher}
        formData={formData}
        handleInputChange={handleInputChange}
        resetForm={resetForm}
      />
    </div>
  );
};

export default Vouchers;
