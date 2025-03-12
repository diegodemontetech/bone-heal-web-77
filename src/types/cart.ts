
export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  product_id?: string;
  total_price?: number;
  weight?: number;
}

export interface CartSummaryProps {
  subtotal: number;
  shippingCost: any;
  total: any;
  zipCode: string;
  onZipCodeChange: (e: any) => void;
  onCalculateShipping: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  shippingCalculated: boolean;
  shippingRates: any[];
  selectedShippingRate: any;
  deliveryDate: Date | null;
  onShippingOptionChange: (rate: any) => void;
}

export interface CartItemProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}
