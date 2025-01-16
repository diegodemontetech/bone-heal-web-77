export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  full_description?: string;
  main_image?: string;
  gallery?: string[];
  price?: number;
  video_url?: string;
  technical_details?: Record<string, any>;
  documents?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  stock?: number;
}