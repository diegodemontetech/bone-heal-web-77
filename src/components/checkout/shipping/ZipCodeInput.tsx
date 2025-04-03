
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

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
  const initialRenderRef = useRef(true);
  const calculatedOnceRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Só calcular frete automaticamente após a primeira renderização 
  // e quando o zipCode mudar (não na montagem inicial)
  useEffect(() => {
    if (!zipCode || zipCode.length !== 8 || !autoCalculate || !onCalculateShipping) {
      return;
    }
    
    // Pular o cálculo automático na primeira renderização
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    // Pular se já calculamos uma vez
    if (calculatedOnceRef.current) {
      return;
    }
    
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Adicionar um pequeno atraso para evitar múltiplas chamadas
    timeoutRef.current = setTimeout(() => {
      onCalculateShipping();
      calculatedOnceRef.current = true;
    }, 500);
    
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
