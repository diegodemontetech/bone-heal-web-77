
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

interface Voucher {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
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

  return (
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
              <TableCell className="font-medium">{voucher.code}</TableCell>
              <TableCell>
                {voucher.discount_type === 'percentage' ? 'Percentual' :
                 voucher.discount_type === 'fixed' ? 'Valor Fixo' : 'Frete Grátis'}
              </TableCell>
              <TableCell>
                {voucher.discount_type === 'percentage' ? `${voucher.discount_value}%` :
                 voucher.discount_type === 'fixed' ? `R$ ${voucher.discount_value.toFixed(2)}` : 'Grátis'}
              </TableCell>
              <TableCell>
                {voucher.valid_until ? new Date(voucher.valid_until).toLocaleDateString('pt-BR') : 'Sem limite'}
              </TableCell>
              <TableCell>
                {voucher.current_uses || 0}/{voucher.max_uses || '∞'}
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
