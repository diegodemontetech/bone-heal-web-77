export interface Product {
  id: string;  // Changed from number to string to match Supabase UUID
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  main_image?: string;
  gallery?: string[];
  price?: number;
  video_url?: string;
  technical_details?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;  // Changed from number to string to match Supabase UUID
  name: string;
  quantity: number;
  price: number;
  image: string;
}