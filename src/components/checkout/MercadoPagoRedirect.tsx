
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

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
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  // Calculate order total correctly
  const subtotal = items && items.length > 0 
    ? items.reduce((acc, item) => acc + (item.price * item.quantity), 0) 
    : 0;
  const total = subtotal + (shippingFee || 0) - (discount || 0);

  useEffect(() => {
    console.log('MercadoPagoRedirect mounted with items:', items);
    console.log('Order details:', { orderId, email, shippingFee, discount });
    console.log('Calculated values:', { subtotal, total });

    // Simulate a payment process
    const timer = setTimeout(() => {
      if (Math.random() > 0.2) {
        setStatus('success');
        setMessage('Seu pagamento foi processado com sucesso!');
        // Clear cart on successful payment
        clearCart();
      } else {
        setStatus('error');
        setMessage('Ocorreu um erro ao processar seu pagamento.');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [clearCart, items, orderId, email, shippingFee, discount, subtotal, total]);

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
                
                {items && items.length > 0 && (
                  <div className="mt-3 mb-3">
                    <h4 className="text-sm font-medium">Itens:</h4>
                    <div className="space-y-1 my-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm pt-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frete:</span>
                        <span>{formatCurrency(shippingFee || 0)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Desconto:</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                )}
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
