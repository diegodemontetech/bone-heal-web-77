
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight?: number; // Adicionando propriedade weight
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  voucherCode: string | null;
  isVoucherValid: boolean;
  voucherDiscount: number;
}
