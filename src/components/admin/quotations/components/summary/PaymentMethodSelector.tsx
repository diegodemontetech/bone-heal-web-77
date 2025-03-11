
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }: PaymentMethodSelectorProps) => {
  const [discounts, setDiscounts] = useState<Record<string, number>>({
    pix: 5, // Valor padrão de desconto para PIX
    boleto: 0,
    credit_card: 0
  });

  // Buscar condições comerciais para métodos de pagamento
  useEffect(() => {
    const fetchPaymentConditions = async () => {
      const { data, error } = await supabase
        .from("commercial_conditions")
        .select("*")
        .eq("is_active", true)
        .neq("payment_method", null);
      
      if (error) {
        console.error("Erro ao buscar condições de pagamento:", error);
        return;
      }
      
      // Criar mapa de método de pagamento para desconto
      const newDiscounts = { ...discounts };
      data?.forEach(condition => {
        if (condition.payment_method && condition.discount_value) {
          newDiscounts[condition.payment_method] = Number(condition.discount_value);
        }
      });
      
      setDiscounts(newDiscounts);
    };
    
    fetchPaymentConditions();
  }, []);

  return (
    <div className="space-y-2">
      <Label>Forma de Pagamento</Label>
      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a forma de pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pix" className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              PIX
              {discounts.pix > 0 && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  {discounts.pix}% de desconto
                </Badge>
              )}
            </div>
          </SelectItem>
          <SelectItem value="boleto">
            <div className="flex items-center gap-2">
              Boleto Bancário
              {discounts.boleto > 0 && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  {discounts.boleto}% de desconto
                </Badge>
              )}
            </div>
          </SelectItem>
          <SelectItem value="credit_card">
            <div className="flex items-center gap-2">
              Cartão de Crédito
              {discounts.credit_card > 0 && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  {discounts.credit_card}% de desconto
                </Badge>
              )}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentMethodSelector;
