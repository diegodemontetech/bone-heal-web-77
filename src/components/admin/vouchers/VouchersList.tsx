
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Voucher } from "@/types/voucher";

interface VouchersListProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: string) => void;
  formatDate: (dateStr: string | null) => string;
}

export const VouchersList = ({
  vouchers,
  onEdit,
  onDelete,
  formatDate
}: VouchersListProps) => {
  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discount_type === "percentage") {
      return `${voucher.discount_amount}%`;
    } else if (voucher.discount_type === "fixed") {
      return `R$ ${voucher.discount_amount.toFixed(2)}`;
    } else {
      return "Frete Grátis";
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Desconto</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Uso Máx.</TableHead>
            <TableHead>Uso Atual</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell className="font-medium">{voucher.code}</TableCell>
              <TableCell>{formatDiscount(voucher)}</TableCell>
              <TableCell>
                {voucher.valid_until ? (
                  <span>
                    <span className="text-xs text-muted-foreground">De:</span> {formatDate(voucher.valid_from)}
                    <br />
                    <span className="text-xs text-muted-foreground">Até:</span> {formatDate(voucher.valid_until)}
                  </span>
                ) : (
                  <span>
                    <span className="text-xs text-muted-foreground">De:</span> {formatDate(voucher.valid_from)}
                    <br />
                    <span className="text-xs text-muted-foreground">Até:</span> Sem data limite
                  </span>
                )}
              </TableCell>
              <TableCell>{voucher.max_uses || "Ilimitado"}</TableCell>
              <TableCell>{voucher.current_uses || 0}</TableCell>
              <TableCell>
                <Badge variant={voucher.is_active ? "success" : "destructive"}>
                  {voucher.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(voucher)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(voucher.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
