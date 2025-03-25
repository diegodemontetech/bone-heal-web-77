
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, RotateCw, TruckIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useEffect } from "react";

interface ShippingCalculatorProps {
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  isCalculatingShipping: boolean;
  shippingCost: number | null;
  shippingError: string | null;
  calculateShipping: () => void;
  shippingCalculated?: boolean;
  resetShipping?: () => void;
  onZipCodeKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ShippingCalculator = ({
  zipCode,
  setZipCode,
  isCalculatingShipping,
  shippingCost,
  shippingError,
  calculateShipping,
  shippingCalculated = false,
  resetShipping,
  onZipCodeKeyDown
}: ShippingCalculatorProps) => {
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir apenas números e limitar a 8 dígitos
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setZipCode(value);
    
    // Se o CEP mudar, resetar o cálculo de frete
    if (value !== zipCode && resetShipping) {
      resetShipping();
    }
  };

  const handleRecalculateClick = () => {
    if (resetShipping) {
      resetShipping();
    }
    calculateShipping();
  };
  
  // Calcular frete automaticamente quando o CEP tiver 8 dígitos
  useEffect(() => {
    if (zipCode.length === 8 && !isCalculatingShipping && !shippingCalculated) {
      calculateShipping();
    }
  }, [zipCode, isCalculatingShipping, shippingCalculated]);

  return (
    <div>
      <Label htmlFor="zipCode" className="text-sm font-medium">Calcular Frete</Label>
      <div className="flex gap-2 mt-1">
        <div className="relative flex-1">
          <TruckIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            id="zipCode"
            placeholder="Digite seu CEP"
            value={zipCode}
            onChange={handleZipCodeChange}
            onKeyDown={onZipCodeKeyDown}
            maxLength={8}
            className={`pl-9 ${shippingError ? "border-red-500" : ""}`}
          />
        </div>
        <Button
          onClick={shippingCalculated ? handleRecalculateClick : calculateShipping}
          disabled={isCalculatingShipping || zipCode.length !== 8}
          variant="outline"
          className="min-w-[100px]"
        >
          {isCalculatingShipping ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : shippingCalculated && shippingCost ? (
            <><RotateCw className="w-4 h-4 mr-2" />Recalcular</>
          ) : (
            "Calcular"
          )}
        </Button>
      </div>
      {shippingError && (
        <Alert variant="destructive" className="mt-2 py-2">
          <AlertDescription className="text-sm">{shippingError}</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        Digite apenas os 8 números do seu CEP
      </p>

      {isCalculatingShipping ? (
        <div className="flex justify-center items-center p-4 bg-gray-50 rounded-md mt-3">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-gray-600">Calculando opções de frete...</p>
          </div>
        </div>
      ) : shippingCost ? (
        <div className="bg-green-50 p-3 rounded-md border border-green-100 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center">
              <TruckIcon className="h-4 w-4 mr-2 text-green-600" />
              Frete calculado
            </span>
            <Badge variant="outline" className="bg-green-100">
              {formatCurrency(shippingCost)}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Entrega em até 7 dias úteis
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ShippingCalculator;
