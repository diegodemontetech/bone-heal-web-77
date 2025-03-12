
import { Json } from '@/integrations/supabase/types';

/**
 * Converte um objeto JavaScript para string JSON, tratando arrays vazios como arrays vazios
 * ao invés de null (comportamento que o Supabase espera).
 */
export const stringifyForSupabase = (obj: any): Json => {
  if (Array.isArray(obj) && obj.length === 0) {
    return [];
  }
  
  if (obj === null || obj === undefined) {
    return [];
  }
  
  return obj;
};

/**
 * Parse um objeto JSON do Supabase para um array, com fallback caso seja null
 */
export const parseJsonArray = <T>(json: Json | null, fallback: T[]): T[] => {
  if (!json) return fallback;
  
  if (Array.isArray(json)) {
    return json as T[];
  }
  
  try {
    if (typeof json === 'string') {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : fallback;
    }
  } catch (e) {
    console.error('Erro ao parsear JSON array:', e);
  }
  
  return fallback;
};

/**
 * Parse um objeto JSON do Supabase para um objeto, com fallback caso seja null
 */
export const parseJsonObject = <T extends object>(json: Json | null, fallback: T): T => {
  if (!json) return fallback;
  
  if (typeof json === 'object' && !Array.isArray(json) && json !== null) {
    return json as T;
  }
  
  try {
    if (typeof json === 'string') {
      const parsed = JSON.parse(json);
      return typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null
        ? parsed
        : fallback;
    }
  } catch (e) {
    console.error('Erro ao parsear JSON object:', e);
  }
  
  return fallback;
};
