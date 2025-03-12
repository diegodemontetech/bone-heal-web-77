
/**
 * Utilitários para lidar com JSON em resposta do Supabase
 */

import { Json } from "@/integrations/supabase/types";

/**
 * Converte um valor JSON do Supabase para um array
 * Se já for um array, retorna o valor
 * Se for uma string, tenta fazer o parse
 * Caso contrário, retorna um array vazio
 */
export function parseJsonArray<T = any>(jsonValue: Json | null | undefined, defaultValue: T[] = []): T[] {
  if (!jsonValue) return defaultValue;
  
  if (Array.isArray(jsonValue)) {
    return jsonValue as T[];
  }
  
  if (typeof jsonValue === 'string') {
    try {
      const parsed = JSON.parse(jsonValue);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (error) {
      console.error('Erro ao converter string JSON para array:', error);
      return defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Converte um valor JSON do Supabase para um objeto
 * Se já for um objeto, retorna o valor
 * Se for uma string, tenta fazer o parse
 * Caso contrário, retorna um objeto vazio ou o valor padrão fornecido
 */
export function parseJsonObject<T = Record<string, any>>(
  jsonValue: Json | null | undefined, 
  defaultValue: T = {} as T
): T {
  if (!jsonValue) return defaultValue;
  
  if (typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
    return jsonValue as unknown as T;
  }
  
  if (typeof jsonValue === 'string') {
    try {
      const parsed = JSON.parse(jsonValue);
      return typeof parsed === 'object' && !Array.isArray(parsed) 
        ? parsed 
        : defaultValue;
    } catch (error) {
      console.error('Erro ao converter string JSON para objeto:', error);
      return defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Prepara um objeto para ser armazenado como JSON no Supabase
 */
export function stringifyForSupabase(value: any): Json {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value as Json;
  }
  
  return JSON.stringify(value) as Json;
}
