export interface Product {
  id: string;  // Changed from number to string
  name: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  main_image?: string;
  gallery?: string[];
  video_url?: string;
  technical_details?: Record<string, any>;
  documents?: Record<string, any>;
  certifications?: string[];
  price?: number;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}