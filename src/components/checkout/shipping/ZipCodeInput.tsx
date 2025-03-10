
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ZipCodeInputProps {
  zipCode: string;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ZipCodeInput = ({ zipCode, onZipCodeChange }: ZipCodeInputProps) => {
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
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Digite apenas os 8 números do seu CEP
      </p>
    </div>
  );
};

export default ZipCodeInput;
