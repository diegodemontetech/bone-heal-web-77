
import { Label } from "@/components/ui/label";
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
    <div className="space-y-4">
      <h3 className="text-base font-medium">Opções Adicionais</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="free_shipping">Frete Grátis</Label>
          <p className="text-sm text-muted-foreground">
            Oferecer frete grátis com esta condição
          </p>
        </div>
        <Switch
          id="free_shipping"
          checked={freeShipping}
          onCheckedChange={onFreeShippingChange}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="is_active">Ativar Condição</Label>
          <p className="text-sm text-muted-foreground">
            A condição comercial estará ativa imediatamente
          </p>
        </div>
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={onIsActiveChange}
        />
      </div>
    </div>
  );
};

export default OptionsSection;
