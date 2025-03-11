
interface PaymentSectionProps {
  paymentMethod: string;
}

export const PaymentSection = ({ paymentMethod }: PaymentSectionProps) => {
  const getPaymentMethodDisplay = (method: string) => {
    switch(method) {
      case 'pix': return 'PIX';
      case 'credit_card': return 'Cartão de Crédito';
      case 'boleto': return 'Boleto Bancário';
      default: return 'Não especificado';
    }
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Forma de Pagamento</h3>
      <p>{getPaymentMethodDisplay(paymentMethod)}</p>
    </div>
  );
};
