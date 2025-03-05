
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

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
  session
}: CartSummaryProps) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (shippingCost || 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-bold">Resumo do Pedido</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="zipCode">Calcular Frete</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="zipCode"
              placeholder="CEP"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
              maxLength={8}
            />
            <Button
              variant="outline"
              onClick={calculateShipping}
              disabled={isCalculatingShipping}
            >
              {isCalculatingShipping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Calcular"
              )}
            </Button>
          </div>
          {shippingError && (
            <p className="text-sm text-red-500 mt-1">{shippingError}</p>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span>
              {shippingCost ? formatCurrency(shippingCost) : "-"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={() => handleCheckout(cartItems, subtotal, total)}
          disabled={!session || !shippingCost}
        >
          Finalizar Compra
        </Button>

        {!session && (
          <p className="text-sm text-red-500 text-center">
            Faça login para continuar com a compra
          </p>
        )}
      </div>
    </div>
  );
};
