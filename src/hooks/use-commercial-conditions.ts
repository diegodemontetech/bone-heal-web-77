
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CommercialCondition } from "@/types/commercial-conditions";

interface AppliedCondition {
  condition: CommercialCondition;
  discountAmount: number;
}

export const useCommercialConditions = (
  cartItems: any[],
  paymentMethod: string = "",
  zipCode: string = ""
) => {
  const [loading, setLoading] = useState(false);
  const [appliedConditions, setAppliedConditions] = useState<AppliedCondition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [hasFreeShipping, setHasFreeShipping] = useState(false);

  const getRegionFromZipCode = (zipCode: string): string | null => {
    // Lógica simplificada para determinar a região pelo CEP
    const prefix = zipCode.substring(0, 1);
    
    switch (prefix) {
      case "0":
      case "1":
        return "southeast"; // SP, MG, RJ, ES
      case "2":
        return "northeast"; // BA, SE, AL, PE, PB, RN, CE, PI, MA
      case "3":
        return "southeast"; // MG
      case "4":
        return "northeast"; // BA, SE, AL, PE, PB, RN, CE, PI, MA
      case "5":
        return "north"; // PA, AM, AC, RO, RR, AP, TO
      case "6":
        return "midwest"; // DF, GO, TO, MT, MS
      case "7":
        return "midwest"; // DF, GO, MS, MT
      case "8":
      case "9":
        return "south"; // PR, SC, RS
      default:
        return null;
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateConditionsDiscount = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Buscar todas as condições comerciais ativas
      const { data: conditions, error } = await supabase
        .from("commercial_conditions")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;

      if (!conditions || conditions.length === 0) {
        setAppliedConditions([]);
        setTotalDiscount(0);
        setHasFreeShipping(false);
        return;
      }

      const subtotal = calculateSubtotal();
      const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      const region = getRegionFromZipCode(zipCode);
      
      const product_ids = cartItems.map(item => item.id);
      const product_categories = [...new Set(cartItems.map(item => item.category))];

      // Filtrar condições comerciais aplicáveis ao carrinho atual
      const applicableConditions = conditions.filter((condition: CommercialCondition) => {
        // Verificar condições mínimas
        if (condition.min_amount && subtotal < condition.min_amount) return false;
        if (condition.min_items && totalItems < condition.min_items) return false;
        
        // Verificar validade
        const now = new Date();
        if (condition.valid_from && new Date(condition.valid_from) > now) return false;
        if (condition.valid_until && new Date(condition.valid_until) < now) return false;
        
        // Verificar método de pagamento
        if (condition.payment_method && condition.payment_method !== paymentMethod) return false;
        
        // Verificar região
        if (condition.region && condition.region !== region) return false;
        
        // Verificar produto específico
        if (condition.product_id && !product_ids.includes(condition.product_id)) return false;
        
        // Verificar categoria de produto
        if (condition.product_category && 
            !product_categories.includes(condition.product_category)) return false;
        
        // A condição é aplicável
        return true;
      });

      // Se não houver condições aplicáveis, retornar
      if (applicableConditions.length === 0) {
        setAppliedConditions([]);
        setTotalDiscount(0);
        setHasFreeShipping(false);
        return;
      }

      // Calcular descontos para cada condição aplicável
      const conditionsWithDiscounts = applicableConditions.map((condition: CommercialCondition) => {
        let discountAmount = 0;
        
        if (condition.discount_type === 'percentage') {
          discountAmount = subtotal * (condition.discount_value / 100);
        } else if (condition.discount_type === 'fixed') {
          discountAmount = Math.min(subtotal, condition.discount_value);
        }
        
        return {
          condition,
          discountAmount
        };
      });

      // Aplicar apenas condições cumulativas ou a melhor não-cumulativa
      let appliedConditions: AppliedCondition[] = [];
      let cumulativeDiscount = 0;
      let bestNonCumulativeDiscount = 0;
      let bestNonCumulativeCondition: CommercialCondition | null = null;
      let freeShipping = false;

      // Separar condições cumulativas e não-cumulativas
      const cumulativeConditions = conditionsWithDiscounts.filter(
        c => c.condition.is_cumulative
      );
      
      const nonCumulativeConditions = conditionsWithDiscounts.filter(
        c => !c.condition.is_cumulative
      );

      // Processar condições cumulativas
      cumulativeConditions.forEach(({condition, discountAmount}) => {
        appliedConditions.push({condition, discountAmount});
        cumulativeDiscount += discountAmount;
        
        if (condition.free_shipping) {
          freeShipping = true;
        }
      });

      // Encontrar a melhor condição não-cumulativa
      if (nonCumulativeConditions.length > 0) {
        const bestCondition = nonCumulativeConditions.reduce((best, current) => {
          return current.discountAmount > best.discountAmount ? current : best;
        });
        
        bestNonCumulativeDiscount = bestCondition.discountAmount;
        bestNonCumulativeCondition = bestCondition.condition;
        
        if (bestNonCumulativeCondition.free_shipping) {
          freeShipping = true;
        }
      }

      // Determinar qual usar (cumulativas ou a melhor não-cumulativa)
      if (bestNonCumulativeDiscount > cumulativeDiscount) {
        // Usar apenas a melhor não-cumulativa
        appliedConditions = bestNonCumulativeCondition ? [{
          condition: bestNonCumulativeCondition,
          discountAmount: bestNonCumulativeDiscount
        }] : [];
        
        setTotalDiscount(bestNonCumulativeDiscount);
      } else {
        // Usar condições cumulativas
        setTotalDiscount(cumulativeDiscount);
      }

      setAppliedConditions(appliedConditions);
      setHasFreeShipping(freeShipping);
      
    } catch (err: any) {
      console.error("Erro ao calcular condições comerciais:", err);
      setError(err.message || "Erro ao calcular descontos");
      setAppliedConditions([]);
      setTotalDiscount(0);
      setHasFreeShipping(false);
    } finally {
      setLoading(false);
    }
  };

  // Recalcular quando os itens do carrinho ou método de pagamento mudam
  useEffect(() => {
    calculateConditionsDiscount();
  }, [JSON.stringify(cartItems), paymentMethod, zipCode]);

  return {
    loading,
    appliedConditions,
    totalDiscount,
    hasFreeShipping,
    error,
    recalculate: calculateConditionsDiscount
  };
};
