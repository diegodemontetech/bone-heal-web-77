
import { ProductCategory, ProductSubcategory } from "@/types/product";
import { Json } from "@/integrations/supabase/types";

export interface SubcategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: ProductCategory;
  subcategory?: ProductSubcategory | null;
}

export interface CustomFieldsProps {
  fields: Record<string, any>;
  onFieldChange: (fieldName: string, value: any) => void;
  onAddField: () => void;
}

export interface FormFields {
  name: string;
  description?: string;
  default_fields?: Record<string, any>;
}
