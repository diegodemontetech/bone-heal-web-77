
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Truck, Loader2 } from "lucide-react";
import { ShippingCalculationRate } from "@/types/shipping";

interface ShippingOptionsProps {
  shippingRates: ShippingCalculationRate[];
  selectedShippingRate: ShippingCalculationRate | null;
  onShippingRateChange: (rate: ShippingCalculationRate) => void;
  shippingLoading?: boolean;
}

const ShippingOptions = ({
  shippingRates,
  selectedShippingRate,
  onShippingRateChange,
  shippingLoading = false
}: ShippingOptionsProps) => {
  if (shippingLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-gray-600">
            Calculando opções de frete...
          </p>
        </div>
      </div>
    );
  }

  if (!shippingRates || shippingRates.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-center">
        <p className="text-gray-600">
          Nenhuma opção de frete disponível. Verifique o CEP informado.
        </p>
      </div>
    );
  }

  return (
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
  );
};

export default ShippingOptions;
