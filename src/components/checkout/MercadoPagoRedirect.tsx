
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import QRCodeDisplay from '@/components/checkout/payment/QRCodeDisplay';

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
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting'>('loading');
  const [message, setMessage] = useState('');
  const [pixCode, setPixCode] = useState('');
  
  // Calculate order total correctly
  const subtotal = items && items.length > 0 
    ? items.reduce((acc, item) => acc + (item.price * item.quantity), 0) 
    : 0;
  const total = subtotal + (shippingFee || 0) - (discount || 0);

  useEffect(() => {
    console.log('Redirecionamento do Mercado Pago iniciado');
    console.log('Detalhes do pedido:', { orderId, email, shippingFee, discount });
    console.log('Itens do pedido:', items);

    // Gerar código PIX simulado para demonstração
    setTimeout(() => {
      // Simulando um código PIX
      const mockPixCode = '00020126580014BR.GOV.BCB.PIX013654321098765432109876543210123BONEHEALCOMPRAONLINE520400005303986540' + total.toFixed(2) + '6009SAO PAULO62090505123456304ABCD';
      setPixCode(mockPixCode);
      setStatus('waiting');
      setMessage('Aguardando o pagamento via PIX');
    }, 1500);
  }, [clearCart, items, orderId, email, shippingFee, discount, subtotal, total]);

  // Função para simular confirmação de pagamento (apenas para demonstração)
  const handleSimulatePayment = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setMessage('Seu pagamento foi processado com sucesso!');
      clearCart();
      toast.success('Pagamento confirmado com sucesso!');
    }, 1500);
  };

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
                Por favor, aguarde enquanto preparamos seu pagamento...
              </p>
            </div>
          )}

          {status === 'waiting' && (
            <div className="flex flex-col items-center py-8">
              <h2 className="text-xl font-bold mb-4">Pagamento via PIX</h2>
              <p className="text-center text-muted-foreground mb-6">
                Escaneie o QR Code abaixo ou copie o código PIX para realizar o pagamento
              </p>
              
              <QRCodeDisplay 
                pixCode={pixCode}
                isLoading={false}
              />
              
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
              
              {/* APENAS PARA DEMONSTRAÇÃO - botão para simular pagamento confirmado */}
              <Button onClick={handleSimulatePayment} className="mt-4 w-full bg-green-600 hover:bg-green-700">
                Simular Pagamento Confirmado
              </Button>
              
              <Button onClick={handleRetryPayment} className="mt-2 w-full" variant="outline">
                Voltar para o checkout
              </Button>
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
