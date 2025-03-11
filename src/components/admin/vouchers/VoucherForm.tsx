
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Voucher } from "@/types/voucher";

interface VoucherFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const VoucherForm = ({
  formData,
  handleInputChange,
  onSubmit,
  onCancel,
  isEditing,
}: VoucherFormProps) => {
  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="code">Código do Cupom</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          placeholder="PROMO10"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_percentage">Desconto em Porcentagem (%)</Label>
          <Input
            id="discount_percentage"
            name="discount_percentage"
            type="number"
            min="0"
            max="100"
            value={formData.discount_percentage}
            onChange={handleInputChange}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount_amount">Desconto em Valor (R$)</Label>
          <Input
            id="discount_amount"
            name="discount_amount"
            type="number"
            min="0"
            value={formData.discount_amount}
            onChange={handleInputChange}
            placeholder="50.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_uses">Limite de Usos</Label>
          <Input
            id="max_uses"
            name="max_uses"
            type="number"
            min="0"
            value={formData.max_uses}
            onChange={handleInputChange}
            placeholder="100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimum_purchase">Compra Mínima (R$)</Label>
          <Input
            id="minimum_purchase"
            name="minimum_purchase"
            type="number"
            min="0"
            value={formData.minimum_purchase}
            onChange={handleInputChange}
            placeholder="100.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valid_from">Válido a partir de</Label>
          <Input
            id="valid_from"
            name="valid_from"
            type="date"
            value={formData.valid_from}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="valid_until">Válido até</Label>
          <Input
            id="valid_until"
            name="valid_until"
            type="date"
            value={formData.valid_until}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => 
            handleInputChange({
              target: { name: "is_active", type: "checkbox", checked }
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
        <Label htmlFor="is_active">Cupom Ativo</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          {isEditing ? "Atualizar Cupom" : "Criar Cupom"}
        </Button>
      </div>
    </div>
  );
};
