
/**
 * Utilitário para parse e stringify de arrays JSON para o Supabase
 */

import { Json } from '@/integrations/supabase/types';

// Converte um array ou objeto em uma string JSON segura para o Supabase
export const stringifyForSupabase = <T>(data: T): string => {
  if (!data) return '[]';
  return JSON.stringify(data);
};

// Converte uma string JSON do Supabase em um array ou objeto com tipo
export const parseJsonArray = <T>(json: string | any[] | Json | null, defaultValue: T[]): T[] => {
  if (!json) return defaultValue;
  
  // Se já for um array, retorna diretamente
  if (Array.isArray(json)) return json as unknown as T[];
  
  // Se for um número, string, ou boolean, retorna o valor padrão
  if (typeof json === 'number' || typeof json === 'boolean') return defaultValue;
  
  try {
    // Tenta fazer o parse da string JSON
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return Array.isArray(parsed) ? parsed as T[] : defaultValue;
  } catch (error) {
    console.error('Erro ao fazer parse de JSON:', error);
    return defaultValue;
  }
};

// Converte uma string JSON do Supabase em um objeto com tipo
export const parseJsonObject = <T>(json: string | object | Json | null, defaultValue: T): T => {
  if (!json) return defaultValue;
  
  // Se for um número, string, ou boolean, retorna o valor padrão
  if (typeof json === 'number' || typeof json === 'boolean') return defaultValue;
  
  // Se já for um objeto e não um array, retorna diretamente
  if (typeof json === 'object' && !Array.isArray(json)) return json as unknown as T;
  
  try {
    // Tenta fazer o parse da string JSON
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return !Array.isArray(parsed) && typeof parsed === 'object' ? parsed as T : defaultValue;
  } catch (error) {
    console.error('Erro ao fazer parse de JSON:', error);
    return defaultValue;
  }
};
