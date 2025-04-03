
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

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
  const [hasCalculated, setHasCalculated] = useState(false);
  const calculationTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialMountRef = useRef(true);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (calculationTimeout.current) {
        clearTimeout(calculationTimeout.current);
      }
    };
  }, []);

  // Only calculate shipping after initial render and when zipCode changes
  useEffect(() => {
    // Skip if no zipCode, zipCode is not complete, auto-calculate is disabled, 
    // no calculation function, or we've already calculated
    if (!zipCode || zipCode.length !== 8 || !autoCalculate || !onCalculateShipping) {
      return;
    }
    
    // Skip calculation on the initial mount unless explicitly told not to
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    
    // Clear any existing timeout
    if (calculationTimeout.current) {
      clearTimeout(calculationTimeout.current);
    }
    
    // Set timeout to prevent multiple rapid calculations
    calculationTimeout.current = setTimeout(() => {
      if (!hasCalculated) {
        onCalculateShipping();
        setHasCalculated(true);
      }
    }, 500);
    
  }, [zipCode, autoCalculate, onCalculateShipping, hasCalculated]);

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
            onClick={() => {
              if (!hasCalculated) {
                onCalculateShipping();
                setHasCalculated(true);
              }
            }}
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
