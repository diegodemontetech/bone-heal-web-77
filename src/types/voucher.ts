
export interface Voucher {
  id: string;
  code: string;
  discount_percentage: number;
  discount_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  minimum_purchase: number | null;
  is_active: boolean;
  created_at: string;
}
