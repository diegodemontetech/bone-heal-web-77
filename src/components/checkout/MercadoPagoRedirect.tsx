
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createMercadoPagoCheckout } from '@/services/payment-service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MercadoPagoRedirectProps {
  orderId?: string;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingFee?: number;
  discount?: number;
  email?: string;
}

const MercadoPagoRedirect = ({
  orderId = '',
  items = [],
  shippingFee = 0,
  discount = 0,
  email = ''
}: MercadoPagoRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const redirectToMercadoPago = async () => {
      try {
        setIsRedirecting(true);
        console.log("Iniciando redirecionamento para Mercado Pago...");
        console.log("Dados do pedido:", { orderId, items, shippingFee, discount, email });
        
        // Converter os itens do carrinho para o formato esperado pelo Mercado Pago
        const mpItems = items.map(item => ({
          title: item.name,
          quantity: item.quantity,
          price: item.price
        }));
        
        // Chamar o serviço para criar a preferência no Mercado Pago
        const result = await createMercadoPagoCheckout(orderId, mpItems, shippingFee, discount);
        
        if (result && result.init_point) {
          console.log("Redirecionamento para:", result.init_point);
          
          // Redirecionar diretamente para a página do Mercado Pago
          window.location.href = result.init_point;
        } else {
          console.error("Falha no redirecionamento: Sem URL de checkout", result);
          toast.error("Não foi possível criar o link de pagamento");
          navigate('/checkout/error');
        }
      } catch (error) {
        console.error("Erro ao redirecionar para o Mercado Pago:", error);
        toast.error("Erro ao processar pagamento. Por favor, tente novamente.");
        navigate('/checkout/error');
      } finally {
        setIsRedirecting(false);
      }
    };

    redirectToMercadoPago();
  }, [orderId, items, shippingFee, discount, email, navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h2 className="text-lg font-medium mb-2">Preparando seu pagamento...</h2>
      <p className="text-muted-foreground">Você será redirecionado para o Mercado Pago em instantes</p>
    </div>
  );
};

export default MercadoPagoRedirect;
