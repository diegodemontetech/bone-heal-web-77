
import { Label } from "@/components/ui/label";
import { ShippingCalculationRate } from "@/types/shipping";
import { useShippingCalculation } from "../../hooks/useShippingCalculation";
import ZipCodeInput from "./shipping/ZipCodeInput";
import ShippingOptions from "./shipping/ShippingOptions";

interface ShippingSectionProps {
  zipCode: string;
  setZipCode: (value: string) => void;
  selectedShipping: ShippingCalculationRate | null;
  setSelectedShipping: (shipping: ShippingCalculationRate | null) => void;
  customerZipCode?: string;
}

const ShippingSection = ({ 
  zipCode, 
  setZipCode, 
  selectedShipping, 
  setSelectedShipping,
  customerZipCode
}: ShippingSectionProps) => {
  const {
    handleZipCodeChange,
    isCalculatingShipping,
    calculateShipping,
    shippingOptions,
    setSelectedShipping: setSelectedShippingOption
  } = useShippingCalculation(zipCode, customerZipCode);

  const handleShippingSelect = (value: string) => {
    const selected = shippingOptions.find(option => option.id === value);
    setSelectedShipping(selected || null);
    setSelectedShippingOption(selected || null);
  };

  return (
    <div className="space-y-4">
      <Label>Frete</Label>
      
      <ZipCodeInput 
        zipCode={zipCode}
        onZipCodeChange={(e) => {
          handleZipCodeChange(e);
          setZipCode(e.target.value);
        }}
        onCalculateShipping={calculateShipping}
        isCalculatingShipping={isCalculatingShipping}
      />
      
      <ShippingOptions 
        shippingOptions={shippingOptions}
        selectedShipping={selectedShipping}
        onShippingSelect={handleShippingSelect}
      />
    </div>
  );
};

export default ShippingSection;
