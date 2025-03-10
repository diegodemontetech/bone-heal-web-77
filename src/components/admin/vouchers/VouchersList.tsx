
import { Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Voucher {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  min_amount: number | null;
  min_items: number | null;
  payment_method: string | null;
}

interface VouchersListProps {
  vouchers: Voucher[] | null;
  isLoading: boolean;
  onDelete: () => void;
}

const VouchersList = ({ vouchers, isLoading, onDelete }: VouchersListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Cupom excluído com sucesso!");
      onDelete();
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir cupom");
    } finally {
      setDeletingId(null);
    }
  };
  
  const formatPaymentMethod = (method: string | null) => {
    if (!method) return "Qualquer";
    switch(method) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'boleto': return 'Boleto';
      case 'pix': return 'PIX';
      default: return method;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Desconto</TableHead>
          <TableHead>Validade</TableHead>
          <TableHead>Usos</TableHead>
          <TableHead>Condições</TableHead>
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
              <TableCell className="font-medium">{voucher.code}</TableCell>
              <TableCell>
                {voucher.discount_type === 'percentage' ? (
                  <Badge variant="outline" className="bg-blue-50">
                    {voucher.discount_value}%
                  </Badge>
                ) : voucher.discount_type === 'fixed' ? (
                  <Badge variant="outline" className="bg-green-50">
                    R$ {voucher.discount_value.toFixed(2)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50">
                    Frete Grátis
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {voucher.valid_until ? (
                  new Date(voucher.valid_until).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                ) : (
                  <span className="text-gray-500">Sem limite</span>
                )}
              </TableCell>
              <TableCell>
                <span className="whitespace-nowrap">
                  {voucher.current_uses || 0}/{voucher.max_uses ? 
                    voucher.max_uses : 
                    <span className="text-gray-500">∞</span>}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-sm">
                  {voucher.payment_method && (
                    <span className="whitespace-nowrap">
                      Pagamento: {formatPaymentMethod(voucher.payment_method)}
                    </span>
                  )}
                  {voucher.min_amount && (
                    <span className="whitespace-nowrap">
                      Min: R$ {voucher.min_amount.toFixed(2)}
                    </span>
                  )}
                  {voucher.min_items && (
                    <span className="whitespace-nowrap">
                      Min: {voucher.min_items} {voucher.min_items === 1 ? 'item' : 'itens'}
                    </span>
                  )}
                  {!voucher.payment_method && !voucher.min_amount && !voucher.min_items && (
                    <span className="text-gray-500">Sem condições</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(voucher.id)}
                  disabled={deletingId === voucher.id}
                >
                  {deletingId === voucher.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-500" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default VouchersList;
