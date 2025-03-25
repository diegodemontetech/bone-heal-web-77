
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ShoppingBag } from "lucide-react";

interface CheckoutButtonProps {
  isProcessing: boolean;
  onClick: () => void;
}

const CheckoutButton = ({
  isProcessing,
  onClick
}: CheckoutButtonProps) => {
  return (
    <Button
      className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base flex items-center justify-center font-semibold uppercase"
      onClick={onClick}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          PROCESSANDO PAGAMENTO...
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-5 w-5" />
          FINALIZAR COMPRA
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
};

export default CheckoutButton;
