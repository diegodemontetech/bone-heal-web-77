
// Vamos corrigir a função insertShippingRates para usar stringifyForSupabase
import { stringifyForSupabase } from "@/utils/supabaseJsonUtils";

// E modificar o insertShippingRates para incluir os campos obrigatórios
const insertShippingRates = async (rates) => {
  const { error } = await supabase.from('shipping_rates').insert(rates.map(rate => ({
    ...rate,
    rate: rate.flat_rate || 0, // adiciona campo obrigatório
    state: rate.region || 'Não especificado', // adiciona campo obrigatório ou deriva do region
  })));
  
  return { error };
};
