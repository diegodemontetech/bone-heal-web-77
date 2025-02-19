
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Tag } from "lucide-react";

interface DeliveryInformationProps {
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  calculateShipping: (zipCode: string) => void;
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  voucherLoading: boolean;
  appliedVoucher: any;
  applyVoucher: () => void;
  removeVoucher: () => void;
}

const DeliveryInformation = ({
  zipCode,
  setZipCode,
  calculateShipping,
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
        <CardTitle>Informações de Entrega</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <div className="flex gap-2">
            <Input
              id="zipCode"
              placeholder="00000-000"
              value={zipCode}
              onChange={(e) => {
                const newZip = e.target.value.replace(/\D/g, "");
                setZipCode(newZip);
                if (newZip.length === 8) {
                  calculateShipping(newZip);
                }
              }}
              maxLength={8}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="voucher">Cupom de Desconto</Label>
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
              {voucherLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Tag className="w-4 h-4" />
              )}
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
