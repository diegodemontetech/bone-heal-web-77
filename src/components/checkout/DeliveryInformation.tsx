
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tag, Truck, Loader2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { fetchAddressFromCep } from "@/utils/address";
import { toast } from "@/components/ui/use-toast";

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
  shippingLoading?: boolean;
  zipCode?: string;
  setZipCode?: (zipCode: string) => void;
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
  shippingLoading = false,
  zipCode = "",
  setZipCode
}: DeliveryInformationProps) => {
  const session = useSession();
  const [localZipCode, setLocalZipCode] = useState(zipCode);

  // Atualizar o CEP local quando o CEP prop mudar
  useEffect(() => {
    if (zipCode) {
      setLocalZipCode(zipCode);
    }
  }, [zipCode]);

  // Função para lidar com a mudança do CEP
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setLocalZipCode(value);
    
    if (setZipCode && value.length === 8) {
      setZipCode(value);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-primary">Entrega</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Campo de CEP */}
          {setZipCode && (
            <div className="mb-6">
              <Label htmlFor="shipping-zipcode">CEP</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="shipping-zipcode"
                  placeholder="Digite seu CEP"
                  value={localZipCode}
                  onChange={handleZipCodeChange}
                  maxLength={8}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Digite apenas os 8 números do seu CEP
              </p>
            </div>
          )}
          
          {shippingLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-gray-600">
                  Calculando opções de frete...
                </p>
              </div>
            </div>
          ) : shippingRates && shippingRates.length > 0 ? (
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
                        <Truck className="h-4 w-4 text-primary" />
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
          ) : (
            <div className="p-4 bg-gray-50 rounded-md text-center">
              <p className="text-gray-600">
                Nenhuma opção de frete disponível. Verifique o CEP informado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-primary">Cupom de Desconto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryInformation;
