
export interface Voucher {
  id: string;
  code: string;
  discount_value: number;
  discount_type: string;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  min_amount: number | null;
  is_active: boolean;
  created_at: string;
  payment_method?: string | null;
}
