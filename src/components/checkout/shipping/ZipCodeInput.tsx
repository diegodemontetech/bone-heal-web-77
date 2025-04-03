
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface ZipCodeInputProps {
  zipCode: string;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculateShipping?: () => void;
  autoCalculate?: boolean;
}

const ZipCodeInput = ({ 
  zipCode, 
  onZipCodeChange, 
  onCalculateShipping,
  autoCalculate = true
}: ZipCodeInputProps) => {
  // Automatically calculate shipping when zipCode changes and has 8 digits
  useEffect(() => {
    if (autoCalculate && zipCode && zipCode.length === 8 && onCalculateShipping) {
      onCalculateShipping();
    }
  }, [zipCode, autoCalculate, onCalculateShipping]);

  return (
    <div className="mb-6">
      <Label htmlFor="shipping-zipcode">CEP</Label>
      <div className="flex gap-2 mt-1">
        <Input
          id="shipping-zipcode"
          placeholder="Digite seu CEP"
          value={zipCode}
          onChange={onZipCodeChange}
          maxLength={8}
          className="flex-1"
        />
        {!autoCalculate && onCalculateShipping && (
          <button 
            onClick={onCalculateShipping}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Calcular
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Digite apenas os 8 números do seu CEP
      </p>
    </div>
  );
};

export default ZipCodeInput;
