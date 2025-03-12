
import { Json } from "@/integrations/supabase/types";

/**
 * Converte um campo JSON do Supabase para um objeto JavaScript.
 * Lida com os casos em que o valor pode ser uma string JSON ou já um objeto.
 */
export function parseSupabaseJson<T>(jsonValue: Json | null | undefined, defaultValue: T): T {
  if (jsonValue === null || jsonValue === undefined) {
    return defaultValue;
  }

  if (typeof jsonValue === 'string') {
    try {
      return JSON.parse(jsonValue) as T;
    } catch (e) {
      console.error("Erro ao fazer parse de JSON:", e);
      return defaultValue;
    }
  }

  // Se for um array ou um objeto, tentamos retornar como está
  return jsonValue as unknown as T;
}

/**
 * Verifica se um valor JSON do Supabase é um array válido
 * e o converte para o tipo esperado.
 */
export function parseSupabaseJsonArray<T>(jsonValue: Json | null | undefined): T[] {
  const parsed = parseSupabaseJson<unknown>(jsonValue, []);
  
  if (Array.isArray(parsed)) {
    return parsed as T[];
  }
  
  return [];
}

/**
 * Converte um objeto para formato JSON, garantindo compatibilidade
 * com o tipo Json do Supabase.
 */
export function stringifyForSupabase(value: any): Json {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  return JSON.stringify(value);
}
