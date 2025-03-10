
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/hooks/use-cart";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useEffect } from "react";
import ShippingCalculator from "./shipping/ShippingCalculator";
import OrderSummaryValues from "./OrderSummaryValues";
import CheckoutButton from "./CheckoutButton";

interface CartSummaryProps {
  cartItems: CartItem[];
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  isCalculatingShipping: boolean;
  shippingCost: number | null;
  shippingError: string | null;
  calculateShipping: () => void;
  handleCheckout: (cartItems: CartItem[], subtotal: number, total: number) => void;
  session: any;
  isAuthenticated?: boolean;
  shippingCalculated?: boolean;
  resetShipping?: () => void;
}

export const CartSummary = ({
  cartItems,
  zipCode,
  setZipCode,
  isCalculatingShipping,
  shippingCost,
  shippingError,
  calculateShipping,
  handleCheckout,
  session,
  isAuthenticated = false,
  shippingCalculated = false,
  resetShipping
}: CartSummaryProps) => {
  const calculationRequested = useRef(false);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (shippingCost || 0);

  const handleZipCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && zipCode.length === 8 && !isCalculatingShipping) {
      calculateShipping();
      calculationRequested.current = true;
    }
  };

  // Calcular frete automaticamente quando o CEP tiver 8 dígitos
  useEffect(() => {
    if (zipCode.length === 8 && !shippingCalculated && !isCalculatingShipping && 
        !calculationRequested.current && cartItems.length > 0) {
      calculateShipping();
      calculationRequested.current = true;
    }
  }, [zipCode, cartItems.length, shippingCalculated, isCalculatingShipping, calculateShipping]);

  return (
    <Card className="bg-white shadow-md border rounded-lg">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary border-b pb-2">Resumo do Pedido</h2>

        <div className="space-y-4">
          <ShippingCalculator 
            zipCode={zipCode}
            setZipCode={setZipCode}
            isCalculatingShipping={isCalculatingShipping}
            shippingCost={shippingCost}
            shippingError={shippingError}
            calculateShipping={calculateShipping}
            shippingCalculated={shippingCalculated}
            resetShipping={resetShipping}
            onZipCodeKeyDown={handleZipCodeKeyDown}
          />

          <Separator />

          <OrderSummaryValues 
            cartItems={cartItems}
            shippingCost={shippingCost}
          />

          <CheckoutButton 
            cartItems={cartItems}
            subtotal={subtotal}
            total={total}
            isAuthenticated={isAuthenticated || false}
            shippingCost={shippingCost}
            handleCheckout={handleCheckout}
          />
        </div>
      </CardContent>
    </Card>
  );
};
