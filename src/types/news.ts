export interface NewsItem {
  id: string;  // Changed from number to string to match Supabase UUID
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  featured_image?: string;
  category?: string;
  tags?: string;
  author?: string;
  published_at: string;
  views?: number;
  created_at?: string;
}

export interface Category {
  id: string;  // Changed from number to string to match Supabase UUID
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}