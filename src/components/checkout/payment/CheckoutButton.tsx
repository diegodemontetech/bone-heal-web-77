
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  isLoggedIn: boolean;
  hasZipCode: boolean;
  loading: boolean;
  amount: number;
  paymentMethod: string;
  onCheckout: () => void;
}

const CheckoutButton = ({
  isLoggedIn,
  hasZipCode,
  loading,
  amount,
  paymentMethod,
  onCheckout
}: CheckoutButtonProps) => {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit':
        return 'com Cartão';
      case 'pix':
        return 'com PIX';
      case 'boleto':
        return 'com Boleto';
      default:
        return '';
    }
  };

  return (
    <>
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base"
        size="lg"
        onClick={onCheckout}
        disabled={loading || !isLoggedIn || !hasZipCode}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : !isLoggedIn ? (
          "Entre em sua conta para finalizar a compra"
        ) : !hasZipCode ? (
          "Aguarde o cálculo do frete"
        ) : (
          <>
            Pagar {amount.toFixed(2)} {getPaymentMethodLabel(paymentMethod)} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {!isLoggedIn && (
        <p className="text-sm text-gray-600 text-center">
          Entre em sua conta para finalizar a compra
        </p>
      )}
    </>
  );
};

export default CheckoutButton;
