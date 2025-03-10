
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

interface VoucherInputProps {
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  voucherLoading: boolean;
  appliedVoucher: any;
  applyVoucher: () => void;
  removeVoucher: () => void;
}

const VoucherInput = ({
  voucherCode,
  setVoucherCode,
  voucherLoading,
  appliedVoucher,
  applyVoucher,
  removeVoucher
}: VoucherInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="voucher">Tem um cupom?</Label>
      <div className="flex gap-2">
        <Input
          id="voucher"
          placeholder="Digite seu cupom"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          disabled={!!appliedVoucher}
        />
        <Button 
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={applyVoucher}
          disabled={voucherLoading || !!appliedVoucher}
        >
          <Tag className="w-4 h-4" />
        </Button>
      </div>
      {appliedVoucher && (
        <div className="flex items-center justify-between text-sm text-green-600">
          <span>Cupom aplicado: {appliedVoucher.code}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeVoucher}
            className="text-primary hover:text-primary/80"
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoucherInput;
