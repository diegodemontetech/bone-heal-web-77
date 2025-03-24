import { Loader2, ArrowRight, ShoppingCart, AlertTriangle, Lock, QrCode, FileText } from "lucide-react";
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

  const getButtonText = () => {
    if (loading) {
      return "Processando...";
    }
    
    if (!isLoggedIn) {
      return "Faça login para continuar";
    }
    
    if (!hasZipCode) {
      return "Selecione uma opção de frete";
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

  // Determinar cor do botão com base no método de pagamento
  const getButtonStyles = () => {
    if (!isLoggedIn || !hasZipCode || !paymentMethod || amount <= 0) {
      return "bg-gray-400 hover:bg-gray-500";
    }
    
    switch (paymentMethod) {
      case 'pix':
        return "bg-green-600 hover:bg-green-700";
      case 'credit':
        return "bg-blue-600 hover:bg-blue-700";
      case 'boleto':
        return "bg-orange-600 hover:bg-orange-700";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  return (
    <div className="space-y-3">
      <Button
        className={`w-full text-white h-12 text-base flex items-center justify-center transition-all shadow-sm ${getButtonStyles()}`}
        size="lg"
        onClick={onCheckout}
        disabled={loading || !hasZipCode || amount <= 0 || !isLoggedIn || !paymentMethod}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando pagamento...
          </>
        ) : (
          <>
            {paymentMethod === 'credit' && <Lock className="mr-2 h-5 w-5" />}
            {paymentMethod === 'pix' && <QrCode className="mr-2 h-5 w-5" />}
            {paymentMethod === 'boleto' && <FileText className="mr-2 h-5 w-5" />}
            {!paymentMethod && <ShoppingCart className="mr-2 h-5 w-5" />}
            
            {getButtonText()} 
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </>
        )}
      </Button>

      {!isLoggedIn && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-2 rounded-lg border border-red-100">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p>É necessário estar logado para finalizar a compra</p>
        </div>
      )}
      
      {isLoggedIn && !hasZipCode && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 text-sm p-2 rounded-lg border border-amber-100">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p>Informe seu CEP e selecione uma opção de frete</p>
        </div>
      )}
      
      {isLoggedIn && hasZipCode && !paymentMethod && (
        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 text-sm p-2 rounded-lg border border-blue-100">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p>Selecione um método de pagamento para continuar</p>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mt-2">
        <Lock className="h-3 w-3" />
        <span>Pagamento 100% seguro</span>
      </div>
    </div>
  );
};

export default CheckoutButton;
