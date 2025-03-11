
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { Voucher } from "@/types/voucher";

interface VouchersListProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string | null) => string;
}

export const VouchersList = ({
  vouchers,
  onEdit,
  onDelete,
  formatDate
}: VouchersListProps) => {
  return (
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
                  onClick={() => onEdit(voucher)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => onDelete(voucher.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
