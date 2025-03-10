
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface OptionsSectionProps {
  freeShipping: boolean;
  isActive: boolean;
  onFreeShippingChange: (checked: boolean) => void;
  onIsActiveChange: (checked: boolean) => void;
}

const OptionsSection = ({
  freeShipping,
  isActive,
  onFreeShippingChange,
  onIsActiveChange
}: OptionsSectionProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="free_shipping"
          checked={freeShipping}
          onCheckedChange={(checked) => 
            onFreeShippingChange(checked === true)
          }
        />
        <Label 
          htmlFor="free_shipping" 
          className="font-normal cursor-pointer"
        >
          Incluir frete grátis nesta condição
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) => 
            onIsActiveChange(checked)
          }
        />
        <Label 
          htmlFor="is_active" 
          className="font-normal cursor-pointer"
        >
          Condição ativa
        </Label>
      </div>
    </>
  );
};

export default OptionsSection;
