
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ZipCodeInputProps {
  zipCode: string;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculateShipping: () => void;
  isCalculatingShipping: boolean;
}

const ZipCodeInput = ({
  zipCode,
  onZipCodeChange,
  onCalculateShipping,
  isCalculatingShipping
}: ZipCodeInputProps) => {
  return (
    <div className="flex space-x-2">
      <Input
        placeholder="CEP"
        value={zipCode}
        onChange={onZipCodeChange}
        maxLength={9}
        className="max-w-[120px]"
      />
      <Button 
        variant="outline" 
        onClick={onCalculateShipping} 
        disabled={isCalculatingShipping || !zipCode || zipCode.length < 8}
        type="button"
        size="sm"
      >
        {isCalculatingShipping ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calcular'}
      </Button>
    </div>
  );
};

export default ZipCodeInput;
