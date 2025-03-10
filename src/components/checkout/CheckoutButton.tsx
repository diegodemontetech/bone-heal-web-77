
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  isProcessing: boolean;
  onClick: () => void;
}

const CheckoutButton = ({ isProcessing, onClick }: CheckoutButtonProps) => {
  return (
    <div className="mt-6">
      <Button 
        className="w-full h-12"
        onClick={onClick}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Finalizar compra
          </>
        )}
      </Button>
    </div>
  );
};

export default CheckoutButton;
