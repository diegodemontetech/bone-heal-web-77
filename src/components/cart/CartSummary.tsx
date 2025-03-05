
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import ProductLoading from "@/components/product/ProductLoading";

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
  isAuthenticated = false
}: CartSummaryProps) => {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (shippingCost || 0);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir apenas números e limitar a 8 dígitos
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setZipCode(value);
  };

  const handleZipCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculateShipping();
    }
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { from: "/cart" } });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-bold text-primary">Resumo do Pedido</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="zipCode">Calcular Frete</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="zipCode"
              placeholder="CEP (somente números)"
              value={zipCode}
              onChange={handleZipCodeChange}
              onKeyDown={handleZipCodeKeyDown}
              maxLength={8}
              className={shippingError ? "border-red-500" : ""}
            />
            <Button
              onClick={calculateShipping}
              disabled={isCalculatingShipping || zipCode.length !== 8}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isCalculatingShipping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Calcular"
              )}
            </Button>
          </div>
          {shippingError && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription className="text-sm">{shippingError}</AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Digite apenas os 8 números do seu CEP
          </p>
        </div>

        {isCalculatingShipping && (
          <div className="flex justify-center items-center p-4 bg-gray-50 rounded-md">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-gray-600">Calculando opções de frete...</p>
            </div>
          </div>
        )}

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

        {!isAuthenticated ? (
          <>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
              onClick={handleLoginClick}
            >
              Fazer login para continuar
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Faça login para continuar com a compra
            </p>
          </>
        ) : (
          <>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
              onClick={() => handleCheckout(cartItems, subtotal, total)}
              disabled={!shippingCost}
            >
              Finalizar Compra
            </Button>
            {!shippingCost && (
              <p className="text-sm text-gray-600 text-center">
                Calcule o frete antes de continuar
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
