
// O erro indica que está faltando rate e state nos objetos enviados.
// Adicione esses campos com valores padrão:

const { error } = await supabase.from('shipping_rates').insert(rates.map(rate => ({
  ...rate,
  rate: 0, // adiciona campo obrigatório
  state: rate.region || 'Não especificado', // adiciona campo obrigatório ou deriva do region
})));
