
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

  // Verificação para debug
  console.log("CheckoutButton props:", { isLoggedIn, hasZipCode, loading, amount });

  return (
    <>
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base"
        size="lg"
        onClick={onCheckout}
        disabled={loading || !hasZipCode || amount <= 0}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : !isLoggedIn ? (
          "Faça login para continuar"
        ) : !hasZipCode ? (
          "Selecione uma opção de frete para continuar"
        ) : amount <= 0 ? (
          "Não há valor a pagar"
        ) : (
          <>
            Pagar R$ {amount.toFixed(2)} {getPaymentMethodLabel(paymentMethod)} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {!isLoggedIn && (
        <p className="text-sm text-red-600 text-center mt-2">
          É necessário estar logado para finalizar a compra
        </p>
      )}
      {isLoggedIn && !hasZipCode && (
        <p className="text-sm text-gray-600 text-center mt-2">
          Informe seu CEP e selecione uma opção de frete
        </p>
      )}
    </>
  );
};

export default CheckoutButton;
