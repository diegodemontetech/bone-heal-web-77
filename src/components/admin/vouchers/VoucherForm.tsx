
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
    current_uses: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Garantindo que todos os valores numéricos sejam tratados corretamente
      const preparedData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discount_value: Number(formData.discount_value) || 0,
        max_uses: formData.max_uses ? Number(formData.max_uses) : null,
        min_amount: formData.min_amount ? Number(formData.min_amount) : null,
        min_items: formData.min_items ? Number(formData.min_items) : null,
        current_uses: 0
      };
      
      // Log para debug
      console.log("Dados do cupom a serem inseridos:", preparedData);
      
      const { error, data } = await supabase
        .from('vouchers')
        .insert([preparedData])
        .select();

      if (error) {
        console.error("Erro ao criar cupom:", error);
        throw error;
      }

      console.log("Cupom criado com sucesso:", data);
      toast.success("Cupom criado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      toast.error("Erro ao criar cupom. Verifique os dados e tente novamente.");
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

      <div className="space-y-2">
        <Label htmlFor="discount_value">Valor do Desconto</Label>
        <Input
          id="discount_value"
          type="number"
          required
          value={formData.discount_value}
          onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valid_until">Válido até</Label>
        <Input
          id="valid_until"
          type="datetime-local"
          value={formData.valid_until}
          onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_uses">Limite de Usos</Label>
        <Input
          id="max_uses"
          type="number"
          value={formData.max_uses}
          onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_amount">Valor Mínimo da Compra</Label>
        <Input
          id="min_amount"
          type="number"
          value={formData.min_amount}
          onChange={(e) => setFormData(prev => ({ ...prev, min_amount: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_items">Quantidade Mínima de Itens</Label>
        <Input
          id="min_items"
          type="number"
          value={formData.min_items}
          onChange={(e) => setFormData(prev => ({ ...prev, min_items: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Cupom"}
      </Button>
    </form>
  );
};

export default VoucherForm;
