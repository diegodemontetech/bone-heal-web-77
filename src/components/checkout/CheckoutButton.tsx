
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface CheckoutButtonProps {
  isProcessing: boolean;
  onClick: () => void;
}

const CheckoutButton = ({ isProcessing, onClick }: CheckoutButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isProcessing}
      className="w-full bg-primary hover:bg-primary/90 text-white"
      size="lg"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Ir para Pagamento
        </>
      )}
    </Button>
  );
};

export default CheckoutButton;
