
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormEvent } from "react";

interface VoucherFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const VoucherForm = ({
  formData,
  handleInputChange,
  handleSelectChange,
  onSubmit,
  onCancel,
  isEditing,
}: VoucherFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-2 pb-4">
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

      <div className="space-y-2">
        <Label htmlFor="discount_type">Tipo de Desconto</Label>
        <Select
          value={formData.discount_type}
          onValueChange={(value) => handleSelectChange && handleSelectChange("discount_type", value)}
        >
          <SelectTrigger id="discount_type">
            <SelectValue placeholder="Selecione o tipo de desconto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Porcentagem (%)</SelectItem>
            <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
            <SelectItem value="shipping">Frete Grátis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount_amount">
          {formData.discount_type === "percentage" 
            ? "Desconto (%)" 
            : formData.discount_type === "fixed" 
              ? "Desconto (R$)" 
              : "Valor Mínimo para Frete Grátis (R$)"}
        </Label>
        <Input
          id="discount_amount"
          name="discount_amount"
          type="number"
          min="0"
          value={formData.discount_amount}
          onChange={handleInputChange}
          placeholder={formData.discount_type === "percentage" ? "10" : "50.00"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Método de Pagamento (opcional)</Label>
        <Select
          value={formData.payment_method || "all"}
          onValueChange={(value) => handleSelectChange && handleSelectChange("payment_method", value)}
        >
          <SelectTrigger id="payment_method">
            <SelectValue placeholder="Qualquer método de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os métodos</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
          </SelectContent>
        </Select>
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
          <Label htmlFor="min_amount">Compra Mínima (R$)</Label>
          <Input
            id="min_amount"
            name="min_amount"
            type="number"
            min="0"
            value={formData.min_amount}
            onChange={handleInputChange}
            placeholder="100.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_items">Quantidade Mínima de Itens</Label>
        <Input
          id="min_items"
          name="min_items"
          type="number"
          min="0"
          value={formData.min_items}
          onChange={handleInputChange}
          placeholder="1"
        />
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEditing ? "Atualizar Cupom" : "Criar Cupom"}
        </Button>
      </div>
    </form>
  );
};
