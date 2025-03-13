
import { Json } from "@/integrations/supabase/types";

/**
 * Converte um objeto para string JSON para armazenamento no Supabase
 * @param data Objeto a ser convertido
 * @returns String JSON ou null
 */
export function stringifyForSupabase(data: any): string | null {
  try {
    if (data === null || data === undefined) {
      return null;
    }
    return JSON.stringify(data);
  } catch (error) {
    console.error("Erro ao converter objeto para JSON:", error);
    return null;
  }
}

/**
 * Analisa uma string JSON do Supabase para um array
 * @param jsonData Dados JSON do Supabase
 * @param defaultValue Valor padrão se o parsing falhar
 * @returns Array parseado ou valor padrão
 */
export function parseJsonArray(jsonData: Json, defaultValue: any[] = []): any[] {
  try {
    // Se for diretamente um array, retorna
    if (Array.isArray(jsonData)) {
      return jsonData;
    }
    
    // Se for string, tenta fazer o parse
    if (typeof jsonData === 'string') {
      const parsed = JSON.parse(jsonData);
      return Array.isArray(parsed) ? parsed : defaultValue;
    }
    
    // Outros tipos não podem ser convertidos em array
    return defaultValue;
  } catch (error) {
    console.error("Erro ao converter JSON para array:", error, jsonData);
    return defaultValue;
  }
}

/**
 * Analisa uma string JSON do Supabase para um objeto
 * @param jsonData Dados JSON do Supabase
 * @param defaultValue Valor padrão se o parsing falhar
 * @returns Objeto parseado ou valor padrão
 */
export function parseJsonObject(jsonData: Json, defaultValue: object = {}): object {
  try {
    // Se for diretamente um objeto e não um array, retorna
    if (typeof jsonData === 'object' && jsonData !== null && !Array.isArray(jsonData)) {
      return jsonData;
    }
    
    // Se for string, tenta fazer o parse
    if (typeof jsonData === 'string') {
      const parsed = JSON.parse(jsonData);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) 
        ? parsed 
        : defaultValue;
    }
    
    // Outros tipos não podem ser convertidos em objeto
    return defaultValue;
  } catch (error) {
    console.error("Erro ao converter JSON para objeto:", error, jsonData);
    return defaultValue;
  }
}
