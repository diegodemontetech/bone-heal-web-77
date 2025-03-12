
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { stringifyForSupabase } from "@/utils/supabaseJsonUtils";

// O erro indica que está faltando rate e state nos objetos enviados.
// Adicione esses campos com valores padrão:
const insertShippingRates = async (rates) => {
  const { error } = await supabase.from('shipping_rates').insert(rates.map(rate => ({
    ...rate,
    rate: 0, // adiciona campo obrigatório
    state: rate.region || 'Não especificado', // adiciona campo obrigatório ou deriva do region
  })));
  
  return { error };
};

export const useShippingRates = () => {
  // Código existente do hook
  
  // Garantir que os dados de inserção incluam campos obrigatórios
  const handleCreateRate = async (formData) => {
    try {
      const newRate = {
        ...formData,
        rate: formData.flat_rate || 0,
        state: formData.region || 'Não especificado',
        is_active: true
      };
      
      const { error } = await supabase
        .from('shipping_rates')
        .insert([newRate]);
        
      if (error) throw error;
      
      // Restante do código
    } catch (error) {
      // Tratamento de erro
    }
  };
  
  // Restante do código do hook
  
  return {
    // Retorno dos métodos e estados
  };
};
