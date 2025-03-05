
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
  technical_details?: Record<string, any>;
  documents?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  omie_code?: string;
  omie_sync?: boolean;
  omie_last_update?: string;
  active?: boolean;
  weight?: number;
  categories?: string[];
}
