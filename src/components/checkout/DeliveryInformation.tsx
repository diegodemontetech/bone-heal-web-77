
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tag, Truck } from "lucide-react";

interface ShippingRate {
  rate: number;
  delivery_days: number;
  service_type: string;
  name: string;
}

interface DeliveryInformationProps {
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  voucherLoading: boolean;
  appliedVoucher: any;
  applyVoucher: () => void;
  removeVoucher: () => void;
  shippingRates: ShippingRate[];
  selectedShippingRate: ShippingRate | null;
  onShippingRateChange: (rate: ShippingRate) => void;
}

const DeliveryInformation = ({
  voucherCode,
  setVoucherCode,
  voucherLoading,
  appliedVoucher,
  applyVoucher,
  removeVoucher,
  shippingRates,
  selectedShippingRate,
  onShippingRateChange,
}: DeliveryInformationProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          {shippingRates.length > 0 && (
            <RadioGroup 
              value={selectedShippingRate?.service_type}
              onValueChange={(value) => {
                const rate = shippingRates.find(r => r.service_type === value);
                if (rate) onShippingRateChange(rate);
              }}
              className="gap-4"
            >
              {shippingRates.map((rate) => (
                <div key={rate.service_type} className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value={rate.service_type} id={rate.service_type} />
                  <Label htmlFor={rate.service_type} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>{rate.name}</span>
                      </div>
                      <span className="font-medium">R$ {rate.rate.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Entrega em até {rate.delivery_days} dias úteis
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
};

export default DeliveryInformation;
