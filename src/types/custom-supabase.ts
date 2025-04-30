
// Definição da interface Json para uso local
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Additional type helpers for working with Supabase data
export interface TechnicalDetails {
  bullet_points?: string[];
  dimensions?: string;
  indication?: string;
  [key: string]: any;
}

// Helper function to safely parse technical details
export function parseTechnicalDetails(details: unknown): TechnicalDetails {
  if (!details) {
    return {};
  }
  
  // Handle array case
  if (Array.isArray(details)) {
    console.warn('Technical details is an array, expected object');
    return {};
  }
  
  // Handle string case (JSON string)
  if (typeof details === 'string') {
    try {
      return JSON.parse(details) as TechnicalDetails;
    } catch (e) {
      console.warn('Failed to parse technical_details as JSON string:', e);
      return {};
    }
  }
  
  // Handle primitive types
  if (typeof details !== 'object' || details === null) {
    console.warn('Technical details is not an object:', details);
    return {};
  }
  
  // At this point we know it's an object
  return details as TechnicalDetails;
}
