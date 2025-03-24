
import { CartSummary } from "@/components/cart/CartSummary";

interface CartSummarySectionProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  zipCode: string;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculateShipping: () => void;
  isLoading: boolean;
  error: string | null;
  shippingCalculated: boolean;
  onResetShipping: () => void;
  onCheckout: () => void;
  shippingOptions: any[];
  selectedShippingOption: any;
  onShippingOptionChange: (rate: any) => void;
}

const CartSummarySection = (props: CartSummarySectionProps) => {
  return (
    <CartSummary {...props} />
  );
};

export default CartSummarySection;
