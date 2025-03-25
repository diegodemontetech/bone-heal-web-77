import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from "react-router-dom";
import { useCart } from '@/hooks/use-cart';
import { usePaymentStatusUpdate } from '@/hooks/orders/payment/usePaymentStatusUpdate';

interface PaymentProcessorProps {
  orderId: string;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ orderId }) => {
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateOrderPaymentStatus } = usePaymentStatusUpdate();

  useEffect(() => {
    const processPayment = async () => {
      setLoading(true);
      try {
        // Simulação de processamento de pagamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Lógica para marcar o pedido como pago no banco de dados
        await updateOrderPaymentStatus(orderId, 'paid');

        // Limpar o carrinho e redirecionar para a página de sucesso
        if (cart && typeof cart.clearCart === 'function') {
          cart.clearCart();
        } else {
          console.warn('Função clearCart não encontrada no contexto do carrinho');
        }
        toast.success("Pagamento processado com sucesso!");
        navigate('/success');
      } catch (error) {
        console.error("Erro ao processar pagamento:", error);
        toast.error("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [orderId, navigate, cart, updateOrderPaymentStatus]);

  const getTotalPrice = () => {
    if (cart && typeof cart.getTotalPrice === 'function') {
      return cart.getTotalPrice();
    }
    return 0;
  };

  return (
    <div className="text-center">
      {loading ? (
        <>
          <p>Processando pagamento...</p>
          <div className="loader"></div>
        </>
      ) : (
        <p>
          O total de {formatCurrency(getTotalPrice())} será processado.
        </p>
      )}
    </div>
  );
};

export default PaymentProcessor;
