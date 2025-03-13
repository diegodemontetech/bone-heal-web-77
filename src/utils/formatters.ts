
/**
 * Formata um valor numérico para o formato de moeda brasileiro (R$)
 * @param value Valor numérico a ser formatado
 * @returns String formatada como moeda
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param dateString String de data para formatar
 * @returns String formatada como data
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "Data não disponível";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Formata um ID longo, exibindo apenas os primeiros caracteres
 * @param id ID a ser abreviado
 * @param length Quantidade de caracteres a manter (padrão: 8)
 * @returns ID abreviado
 */
export const formatShortId = (id: string, length: number = 8): string => {
  return id.substring(0, length);
};
