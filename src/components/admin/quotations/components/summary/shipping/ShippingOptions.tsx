
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShippingCalculationRate } from "@/types/shipping";
import { formatCurrency } from "@/lib/utils";

interface ShippingOptionsProps {
  shippingOptions: ShippingCalculationRate[];
  selectedShipping: ShippingCalculationRate | null;
  onShippingSelect: (value: string) => void;
}

const ShippingOptions = ({
  shippingOptions,
  selectedShipping,
  onShippingSelect
}: ShippingOptionsProps) => {
  if (shippingOptions.length === 0) {
    return null;
  }

  return (
    <RadioGroup
      value={selectedShipping?.id || ''}
      onValueChange={onShippingSelect}
      className="mt-3"
    >
      {shippingOptions.map((option, index) => (
        <div key={option.id || index} className="flex items-center space-x-2 border p-2 rounded mb-2">
          <RadioGroupItem value={option.id || String(index)} id={`shipping-${index}`} />
          <Label htmlFor={`shipping-${index}`} className="flex-1 flex justify-between items-center cursor-pointer">
            <div>
              <span className="font-medium">{option.name}</span>
              <p className="text-sm text-muted-foreground">
                Entrega em até {option.delivery_days} dias úteis
              </p>
            </div>
            <span className="font-bold">{formatCurrency(option.rate)}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ShippingOptions;
