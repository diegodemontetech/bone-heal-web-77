export interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  main_image: string | null;
  gallery: string[] | null;
  video_url: string | null;
  technical_details: Record<string, any> | null;
  documents: Record<string, any> | null;
  certifications: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}