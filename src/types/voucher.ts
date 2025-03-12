
export interface Voucher {
  id: string;
  code: string;
  discount_amount: number;
  discount_type: string;
  valid_from: string;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  min_amount: number | null;
  min_items: number | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean; // Propriedade adicionada para controlar se o voucher está ativo
}
