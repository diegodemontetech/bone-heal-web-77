
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface DeliveryInformationProps {
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  voucherLoading: boolean;
  appliedVoucher: any;
  applyVoucher: () => void;
  removeVoucher: () => void;
}

const DeliveryInformation = ({
  voucherCode,
  setVoucherCode,
  voucherLoading,
  appliedVoucher,
  applyVoucher,
  removeVoucher,
}: DeliveryInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cupom de Desconto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              variant="outline" 
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
              >
                Remover
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryInformation;
