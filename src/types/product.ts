
import { Json } from "@/integrations/supabase/types";

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  full_description?: string;
  main_image?: string;
  default_image_url?: string;
  gallery?: string[];
  price?: number;
  video_url?: string;
  technical_details?: Record<string, any> | Json | null;
  documents?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  omie_code?: string;
  omie_sync?: boolean;
  omie_last_update?: string;
  active?: boolean;
  on_order?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  
  // Adding fields used in various components
  image_url?: string;
  dimensions?: string;
  indication?: string;
  category?: string;
  category_id?: string;
  department_id?: string;
}
