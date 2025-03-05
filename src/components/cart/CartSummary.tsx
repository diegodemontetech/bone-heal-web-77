
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag, RotateCw, TruckIcon } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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
  shippingCalculated = false
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
    if (e.key === 'Enter' && zipCode.length === 8 && !shippingCalculated) {
      calculateShipping();
    }
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    
    if (!shippingCost) {
      toast.error("Por favor, calcule o frete antes de continuar");
      return;
    }
    
    handleCheckout(cartItems, subtotal, total);
  };

  return (
    <Card className="bg-white shadow-md border rounded-lg">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary border-b pb-2">Resumo do Pedido</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="zipCode" className="text-sm font-medium">Calcular Frete</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <TruckIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="zipCode"
                  placeholder="Digite seu CEP"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  onKeyDown={handleZipCodeKeyDown}
                  maxLength={8}
                  className={`pl-9 ${shippingError ? "border-red-500" : ""}`}
                />
              </div>
              <Button
                onClick={calculateShipping}
                disabled={isCalculatingShipping || zipCode.length !== 8 || (shippingCalculated && !!shippingCost)}
                variant="outline"
                className="min-w-[100px]"
              >
                {isCalculatingShipping ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : shippingCalculated && shippingCost ? (
                  <RotateCw className="w-4 h-4 mr-2" />
                ) : (
                  "Calcular"
                )}
              </Button>
            </div>
            {shippingError && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertDescription className="text-sm">{shippingError}</AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Digite apenas os 8 números do seu CEP
            </p>
          </div>

          {isCalculatingShipping ? (
            <div className="flex justify-center items-center p-4 bg-gray-50 rounded-md">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-sm text-gray-600">Calculando opções de frete...</p>
              </div>
            </div>
          ) : shippingCost ? (
            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <TruckIcon className="h-4 w-4 mr-2 text-green-600" />
                  Frete calculado
                </span>
                <Badge variant="outline" className="bg-green-100">
                  {formatCurrency(shippingCost)}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Entrega em até 7 dias úteis
              </p>
            </div>
          ) : null}

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frete</span>
              <span className="font-medium">
                {shippingCost ? formatCurrency(shippingCost) : "Calculando..."}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base"
            onClick={handleCheckoutClick}
            disabled={!shippingCost || isCalculatingShipping}
          >
            {!isAuthenticated ? (
              "Entrar para continuar"
            ) : !shippingCost ? (
              "Calcule o frete para continuar"
            ) : (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Finalizar Compra
              </>
            )}
          </Button>

          {!shippingCost && (
            <p className="text-sm text-center text-gray-600">
              Informe seu CEP para calcular o frete
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
