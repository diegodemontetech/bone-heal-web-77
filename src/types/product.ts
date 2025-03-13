
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
  technical_details?: Record<string, any> | null;
  documents?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  omie_code?: string;
  omie_sync?: boolean;
  omie_last_update?: string;
  active?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  department_id?: string;
  category_id?: string;
  subcategory_id?: string;
}

export interface ProductDepartment {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id: string;
  department_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSubcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  default_fields?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
