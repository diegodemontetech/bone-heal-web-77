
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OptionsSectionProps {
  freeShipping: boolean;
  isActive: boolean;
  isCumulative: boolean;
  onFreeShippingChange: (checked: boolean) => void;
  onIsActiveChange: (checked: boolean) => void;
  onIsCumulativeChange: (checked: boolean) => void;
}

const OptionsSection = ({
  freeShipping,
  isActive,
  isCumulative,
  onFreeShippingChange,
  onIsActiveChange,
  onIsCumulativeChange
}: OptionsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Opções Adicionais</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={isActive}
            onCheckedChange={onIsActiveChange}
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            Condição Ativa
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Quando desativada, esta condição não será aplicada
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="free_shipping"
            checked={freeShipping}
            onCheckedChange={onFreeShippingChange}
          />
          <Label htmlFor="free_shipping" className="cursor-pointer">
            Oferecer Frete Grátis
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Ative para oferecer frete grátis como parte desta condição
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_cumulative"
            checked={isCumulative}
            onCheckedChange={onIsCumulativeChange}
          />
          <Label htmlFor="is_cumulative" className="cursor-pointer">
            Permitir Acumulação
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Quando ativada, esta condição pode ser combinada com outras condições comerciais
        </p>
      </div>
    </div>
  );
};

export default OptionsSection;
