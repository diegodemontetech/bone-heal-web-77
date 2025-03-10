import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";
import ZipCodeInput from "./shipping/ZipCodeInput";
import ShippingOptions from "./shipping/ShippingOptions";
import VoucherInput from "./voucher/VoucherInput";
import { ShippingRate } from "@/types/shipping";

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
            <ZipCodeInput 
              zipCode={localZipCode} 
              onZipCodeChange={handleZipCodeChange} 
            />
          )}
          
          <ShippingOptions
            shippingRates={shippingRates}
            selectedShippingRate={selectedShippingRate}
            onShippingRateChange={onShippingRateChange}
            shippingLoading={shippingLoading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-primary">Cupom de Desconto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <VoucherInput
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            voucherLoading={voucherLoading}
            appliedVoucher={appliedVoucher}
            applyVoucher={applyVoucher}
            removeVoucher={removeVoucher}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryInformation;
