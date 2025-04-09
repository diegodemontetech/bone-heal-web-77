
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MercadoPagoRedirectProps {
  orderId: string;
  email: string;
  shippingFee: number;
  discount: number;
  items: Array<{name: string; price: number; quantity: number}>;
}

const MercadoPagoRedirect: React.FC<MercadoPagoRedirectProps> = ({
  orderId,
  email,
  shippingFee,
  discount,
  items
}) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simulate a payment process
    const timer = setTimeout(() => {
      if (Math.random() > 0.2) {
        setStatus('success');
        setMessage('Seu pagamento foi processado com sucesso!');
      } else {
        setStatus('error');
        setMessage('Ocorreu um erro ao processar seu pagamento.');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleReturnToStore = () => {
    navigate('/products');
  };

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="border shadow-lg">
        <CardContent className="p-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h2 className="text-xl font-bold">Processando pagamento</h2>
              <p className="text-muted-foreground mt-2 text-center">
                Por favor, aguarde enquanto processamos seu pagamento...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-green-700">Pagamento confirmado!</h2>
              <p className="text-muted-foreground mt-2 text-center">{message}</p>
              
              <div className="border-t border-gray-200 w-full my-6 pt-6">
                <h3 className="font-medium mb-3">Detalhes do pedido:</h3>
                <p className="text-sm">Pedido: #{orderId}</p>
                <p className="text-sm">Email: {email}</p>
                <p className="text-sm mb-4">Total: {(items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + shippingFee - discount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
              
              <Button onClick={handleReturnToStore} className="mt-4 w-full">
                Voltar para a loja
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-red-700">Erro no pagamento</h2>
              <p className="text-muted-foreground mt-2 text-center">{message}</p>
              <div className="mt-6 space-y-3 w-full">
                <Button onClick={handleRetryPayment} className="w-full" variant="default">
                  Tentar novamente
                </Button>
                <Button onClick={handleReturnToStore} className="w-full" variant="outline">
                  Voltar para a loja
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MercadoPagoRedirect;
