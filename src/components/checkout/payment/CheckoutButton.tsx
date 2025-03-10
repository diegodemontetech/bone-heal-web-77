
import { Loader2, ArrowRight, ShoppingCart } from "lucide-react";
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
        return 'via PIX';
      case 'boleto':
        return 'via Boleto';
      default:
        return '';
    }
  };

  // Verificação para debug
  console.log("CheckoutButton props:", { isLoggedIn, hasZipCode, loading, amount, paymentMethod });

  // Log adicional para debug de autenticação
  if (!isLoggedIn) {
    console.warn("Usuário não autenticado no momento do checkout");
  }

  const getButtonText = () => {
    if (loading) {
      return "Processando...";
    }
    
    if (!isLoggedIn) {
      return "Faça login para continuar";
    }
    
    if (!hasZipCode) {
      return "Selecione uma opção de frete para continuar";
    }
    
    if (amount <= 0) {
      return "Não há valor a pagar";
    }
    
    // Para PIX, quando já temos o QR code gerado, mudamos o texto
    if (paymentMethod === 'pix') {
      return `Finalizar Compra ${getPaymentMethodLabel(paymentMethod)}`;
    }
    
    // Para outros métodos ou quando ainda não temos dados
    return `Pagar R$ ${amount.toFixed(2)} ${getPaymentMethodLabel(paymentMethod)}`;
  };

  return (
    <>
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base"
        size="lg"
        onClick={onCheckout}
        disabled={loading || !hasZipCode || amount <= 0 || !isLoggedIn || !paymentMethod}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            {getButtonText()} 
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
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
      {isLoggedIn && hasZipCode && !paymentMethod && (
        <p className="text-sm text-gray-600 text-center mt-2">
          Selecione um método de pagamento para continuar
        </p>
      )}
    </>
  );
};

export default CheckoutButton;
