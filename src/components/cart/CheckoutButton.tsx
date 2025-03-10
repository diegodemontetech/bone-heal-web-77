
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CheckoutButtonProps {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  isAuthenticated: boolean;
  shippingCost: number | null;
  handleCheckout: (cartItems: CartItem[], subtotal: number, total: number) => void;
}

const CheckoutButton = ({
  cartItems,
  subtotal,
  total,
  isAuthenticated,
  shippingCost,
  handleCheckout
}: CheckoutButtonProps) => {
  const navigate = useNavigate();

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
    <>
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base"
        onClick={handleCheckoutClick}
        disabled={!shippingCost}
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
    </>
  );
};

export default CheckoutButton;
