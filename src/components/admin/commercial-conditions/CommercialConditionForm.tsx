
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface CommercialCondition {
  id: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  payment_method: string | null;
  min_amount: number | null;
  min_items: number | null;
  valid_until: string | null;
  region: string | null;
  customer_group: string | null;
  free_shipping: boolean;
}

interface CommercialConditionFormProps {
  onSuccess: () => void;
  existingCondition?: CommercialCondition | null;
}

const BRAZILIAN_REGIONS = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
const CUSTOMER_GROUPS = ["Varejista", "Distribuidor", "Clínica", "Hospital", "Instituição Pública"];

const CommercialConditionForm = ({ onSuccess, existingCondition }: CommercialConditionFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    is_active: true,
    valid_until: "",
    min_amount: "",
    min_items: "",
    payment_method: "",
    region: "",
    customer_group: "",
    free_shipping: false
  });

  // Carregar dados existentes se estiver no modo de edição
  useEffect(() => {
    if (existingCondition) {
      setFormData({
        name: existingCondition.name,
        description: existingCondition.description || "",
        discount_type: existingCondition.discount_type,
        discount_value: existingCondition.discount_value.toString(),
        is_active: existingCondition.is_active,
        valid_until: existingCondition.valid_until || "",
        min_amount: existingCondition.min_amount ? existingCondition.min_amount.toString() : "",
        min_items: existingCondition.min_items ? existingCondition.min_items.toString() : "",
        payment_method: existingCondition.payment_method || "",
        region: existingCondition.region || "",
        customer_group: existingCondition.customer_group || "",
        free_shipping: existingCondition.free_shipping || false
      });
    }
  }, [existingCondition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error("O nome da condição comercial é obrigatório");
      }

      if (!formData.discount_value && formData.discount_type !== "shipping") {
        throw new Error("O valor do desconto é obrigatório");
      }

      // Preparando os dados para envio
      const preparedData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_type === "shipping" ? 0 : parseFloat(formData.discount_value),
        is_active: formData.is_active,
        valid_until: formData.valid_until || null,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        min_items: formData.min_items ? parseInt(formData.min_items, 10) : null,
        payment_method: formData.payment_method || null,
        region: formData.region || null,
        customer_group: formData.customer_group || null,
        free_shipping: formData.free_shipping
      };

      console.log("Dados a serem enviados:", preparedData);

      let result;
      if (existingCondition) {
        // Modo de edição - atualizar registro existente
        result = await supabase
          .from('commercial_conditions')
          .update(preparedData)
          .eq('id', existingCondition.id);
      } else {
        // Modo de criação - inserir novo registro
        result = await supabase
          .from('commercial_conditions')
          .insert([preparedData]);
      }

      const { error } = result;

      if (error) {
        console.error("Erro na operação:", error);
        throw new Error(error.message);
      }

      toast.success(existingCondition 
        ? "Condição comercial atualizada com sucesso!" 
        : "Condição comercial criada com sucesso!"
      );
      onSuccess();
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(`Erro: ${error.message || "Verifique os dados e tente novamente."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Condição</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Desconto para PIX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descreva a condição comercial"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region">Região (deixe em branco para todas)</Label>
          <Select
            value={formData.region}
            onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as regiões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as regiões</SelectItem>
              {BRAZILIAN_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_group">Grupo de Clientes (deixe em branco para todos)</Label>
          <Select
            value={formData.customer_group}
            onValueChange={(value) => setFormData(prev => ({ ...prev, customer_group: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os grupos</SelectItem>
              {CUSTOMER_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="free_shipping"
          checked={formData.free_shipping}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ 
              ...prev, 
              free_shipping: checked === true
            }))
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
          checked={formData.is_active}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ 
              ...prev, 
              is_active: checked
            }))
          }
        />
        <Label 
          htmlFor="is_active" 
          className="font-normal cursor-pointer"
        >
          Condição ativa
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {loading 
          ? (existingCondition ? "Atualizando..." : "Criando...") 
          : (existingCondition ? "Atualizar Condição" : "Criar Condição")
        }
      </Button>
    </form>
  );
};

export default CommercialConditionForm;
