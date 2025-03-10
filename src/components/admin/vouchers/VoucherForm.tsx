
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoucherFormProps {
  onSuccess: () => void;
}

const VoucherForm = ({ onSuccess }: VoucherFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    valid_until: "",
    max_uses: "",
    min_amount: "",
    min_items: "",
    current_uses: 0,
    payment_method: "" // Nova opção para forma de pagamento
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.code.trim()) {
        throw new Error("O código do cupom é obrigatório");
      }

      if (!formData.discount_value && formData.discount_type !== "shipping") {
        throw new Error("O valor do desconto é obrigatório");
      }

      // Garantindo que todos os valores numéricos sejam tratados corretamente
      // e campos vazios sejam enviados como null para o banco
      const preparedData = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discount_value: formData.discount_type === "shipping" ? 0 : parseFloat(formData.discount_value) || 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses, 10) : null,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        min_items: formData.min_items ? parseInt(formData.min_items, 10) : null,
        current_uses: 0,
        valid_until: formData.valid_until || null,
        payment_method: formData.payment_method || null
      };
      
      // Log para debug
      console.log("Dados do cupom a serem inseridos:", preparedData);
      
      const { error } = await supabase
        .from('vouchers')
        .insert([preparedData]);

      if (error) {
        console.error("Erro ao criar cupom:", error);
        throw new Error(error.message);
      }

      toast.success("Cupom criado com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar cupom:", error);
      toast.error(`Erro ao criar cupom: ${error.message || "Verifique os dados e tente novamente."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Código do Cupom</Label>
        <Input
          id="code"
          required
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
          placeholder="EX: BONEHEAL10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount_type">Tipo de Desconto</Label>
        <Select
          value={formData.discount_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentual</SelectItem>
            <SelectItem value="fixed">Valor Fixo</SelectItem>
            <SelectItem value="shipping">Frete Grátis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.discount_type !== "shipping" && (
        <div className="space-y-2">
          <Label htmlFor="discount_value">
            {formData.discount_type === "percentage" ? "Valor do Desconto (%)" : "Valor do Desconto (R$)"}
          </Label>
          <Input
            id="discount_value"
            type="number"
            required
            value={formData.discount_value}
            onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
            step={formData.discount_type === "percentage" ? "1" : "0.01"}
            min={0}
            max={formData.discount_type === "percentage" ? 100 : undefined}
            placeholder={formData.discount_type === "percentage" ? "Ex: 10" : "Ex: 50.00"}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="valid_until">Válido até (deixe em branco para validade ilimitada)</Label>
        <Input
          id="valid_until"
          type="datetime-local"
          value={formData.valid_until}
          onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_uses">Limite de Usos (deixe em branco para usos ilimitados)</Label>
        <Input
          id="max_uses"
          type="number"
          value={formData.max_uses}
          onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
          min={1}
          placeholder="Sem limite"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="payment_method">Método de Pagamento (deixe em branco para todos)</Label>
        <Select
          value={formData.payment_method}
          onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Qualquer método de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer método</SelectItem>
            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_amount">Valor Mínimo da Compra (deixe em branco se não houver)</Label>
        <Input
          id="min_amount"
          type="number"
          value={formData.min_amount}
          onChange={(e) => setFormData(prev => ({ ...prev, min_amount: e.target.value }))}
          min={0}
          step="0.01"
          placeholder="Sem valor mínimo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_items">Quantidade Mínima de Itens (deixe em branco se não houver)</Label>
        <Input
          id="min_items"
          type="number"
          value={formData.min_items}
          onChange={(e) => setFormData(prev => ({ ...prev, min_items: e.target.value }))}
          min={1}
          placeholder="Sem quantidade mínima"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {loading ? "Criando..." : "Criar Cupom"}
      </Button>
    </form>
  );
};

export default VoucherForm;
