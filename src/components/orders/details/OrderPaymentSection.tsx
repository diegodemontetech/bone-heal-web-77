
import { CreditCard } from "lucide-react";

interface PaymentInfo {
  payment_method?: string;
  payments?: { status?: string }[];
}

const OrderPaymentSection = ({ payment_method, payments }: PaymentInfo) => {
  return (
    <div className="flex items-start gap-4">
      <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <h3 className="font-medium">Pagamento</h3>
        <p className="text-sm text-gray-600">
          Método: {payment_method === 'pix' ? 'PIX' : 
                  payment_method === 'credit' ? 'Cartão de Crédito' : 
                  payment_method === 'boleto' ? 'Boleto' : payment_method}
        </p>
        <p className="text-sm text-gray-600">
          Status: {payments?.[0]?.status === 'pending' ? 'Pendente' :
                  payments?.[0]?.status === 'completed' ? 'Concluído' :
                  payments?.[0]?.status === 'failed' ? 'Falhou' : 
                  payments?.[0]?.status || 'Não disponível'}
        </p>
      </div>
    </div>
  );
};

export default OrderPaymentSection;
