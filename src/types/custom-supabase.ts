
import type { Json } from '@supabase/supabase-js';

// Additional type helpers for working with Supabase data
export interface TechnicalDetails {
  bullet_points?: string[];
  dimensions?: string;
  indication?: string;
  [key: string]: any;
}

// Helper function to safely parse technical details
export function parseTechnicalDetails(details: Record<string, any> | { [key: string]: Json } | Json[] | null): TechnicalDetails {
  if (!details) {
    return {};
  }
  
  if (Array.isArray(details)) {
    console.warn('Technical details is an array, expected object');
    return {};
  }
  
  if (typeof details === 'string') {
    try {
      return JSON.parse(details) as TechnicalDetails;
    } catch (e) {
      console.warn('Failed to parse technical_details as JSON:', e);
      return {};
    }
  }
  
  return details as TechnicalDetails;
}
