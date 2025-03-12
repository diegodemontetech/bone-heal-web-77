
import { ShippingCalculationRate } from "@/types/shipping";

export interface ShippingRateFormData {
  region: string;
  state: string;
  zip_code_start: string;
  zip_code_end: string;
  flat_rate: number;
  rate: number;
  additional_kg_rate: number;
  estimated_days: number;
  is_active: boolean;
}

export interface UseShippingRatesReturn {
  rates: any[];
  loading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  formData: Partial<ShippingRateFormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  resetForm: () => void;
  openEditDialog: (rate: any) => void;
  handleCreateRate: (e: React.FormEvent) => Promise<void>;
  handleDeleteRate: (id: string) => Promise<void>;
  exportRates: () => void;
  insertShippingRates: (rates: any[]) => Promise<void>;
  shippingOptions: ShippingCalculationRate[];
}
