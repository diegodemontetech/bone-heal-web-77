
/**
 * Utilitário para parse e stringify de arrays JSON para o Supabase
 */

// Converte um array ou objeto em uma string JSON segura para o Supabase
export const stringifyForSupabase = <T>(data: T): string => {
  if (!data) return '[]';
  return JSON.stringify(data);
};

// Converte uma string JSON do Supabase em um array ou objeto com tipo
export const parseJsonArray = <T>(json: string | any[] | null, defaultValue: T[]): T[] => {
  if (!json) return defaultValue;
  
  // Se já for um array, retorna diretamente
  if (Array.isArray(json)) return json as unknown as T[];
  
  try {
    // Tenta fazer o parse da string JSON
    return JSON.parse(json) as T[];
  } catch (error) {
    console.error('Erro ao fazer parse de JSON:', error);
    return defaultValue;
  }
};

// Converte uma string JSON do Supabase em um objeto com tipo
export const parseJsonObject = <T>(json: string | object | null, defaultValue: T): T => {
  if (!json) return defaultValue;
  
  // Se já for um objeto e não um array, retorna diretamente
  if (typeof json === 'object' && !Array.isArray(json)) return json as unknown as T;
  
  try {
    // Tenta fazer o parse da string JSON
    return JSON.parse(json as string) as T;
  } catch (error) {
    console.error('Erro ao fazer parse de JSON:', error);
    return defaultValue;
  }
};
