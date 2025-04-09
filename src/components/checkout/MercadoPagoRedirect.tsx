
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import QRCodeDisplay from '@/components/checkout/payment/QRCodeDisplay';
import { processPixPayment, createMercadoPagoCheckout } from '@/services/payment-service';

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
  const [mercadoPagoUrl, setMercadoPagoUrl] = useState('');
  
  // Calculate order total correctly
  const subtotal = items && items.length > 0 
    ? items.reduce((acc, item) => acc + (item.price * item.quantity), 0) 
    : 0;
  const total = subtotal + (shippingFee || 0) - (discount || 0);

  useEffect(() => {
    console.log('Redirecionamento do Mercado Pago iniciado');
    console.log('Detalhes do pedido:', { orderId, email, shippingFee, discount });
    console.log('Itens do pedido:', items);

    const initiateCheckout = async () => {
      try {
        setStatus('loading');
        setMessage('Preparando checkout...');
        
        // Skip if there are no items or the orderId is placeholder/invalid
        if (!items?.length || !orderId || orderId === 'placeholder') {
          throw new Error('Dados do pedido inválidos ou incompletos');
        }

        // Format items for Mercado Pago API
        const formattedItems = items.map(item => ({
          title: item.name,
          quantity: item.quantity,
          price: item.price
        }));

        // Create Mercado Pago checkout
        const response = await createMercadoPagoCheckout(
          orderId,
          formattedItems,
          shippingFee || 0,
          discount || 0
        );

        if (response && response.redirect_url) {
          console.log('Redirecionando para:', response.redirect_url);
          // Redirect to Mercado Pago checkout page
          window.location.href = response.redirect_url;
        } else if (response && response.init_point) {
          console.log('Redirecionando para init_point:', response.init_point);
          window.location.href = response.init_point;
        } else {
          // If there's no redirect URL, fall back to PIX payment
          console.log('Fallback: gerando pagamento PIX');
          await generatePixCode();
        }
      } catch (error) {
        console.error('Erro ao iniciar checkout:', error);
        // Fall back to PIX payment on error
        await generatePixCode();
      }
    };

    // Generate PIX code function
    const generatePixCode = async () => {
      try {
        setStatus('loading');
        setMessage('Gerando código PIX...');
        
        // Use a default total amount if missing or zero to prevent API errors
        const finalTotal = total <= 0 ? 1.0 : total;
        
        // Call the service to generate a real PIX code
        const response = await processPixPayment(orderId, finalTotal);
        
        if (response) {
          console.log("Resposta PIX:", response);
          
          // Store the Mercado Pago redirect URL
          if (response.redirect_url || response.point_of_interaction?.transaction_data?.ticket_url) {
            setMercadoPagoUrl(response.redirect_url || response.point_of_interaction?.transaction_data?.ticket_url || '');
          }
          
          // Determine which QR code to use
          if (response.point_of_interaction?.transaction_data?.qr_code_base64) {
            setPixCode(response.point_of_interaction.transaction_data.qr_code_base64);
          } else if (response.point_of_interaction?.transaction_data?.qr_code) {
            setPixCode(response.point_of_interaction.transaction_data.qr_code);
          } else {
            setPixCode(response.qr_code_text || response.pixCode || '');
          }
          
          setStatus('waiting');
          setMessage('Aguardando o pagamento via PIX');
          toast.success("Código PIX gerado com sucesso!");
          
          // Automatically redirect to Mercado Pago if available
          if (response.redirect_url) {
            toast.info("Você pode pagar no site do Mercado Pago", {
              action: {
                label: "Ir agora",
                onClick: () => window.open(response.redirect_url, '_blank')
              },
            });
          }
        } else {
          console.error("Resposta inválida do servidor de pagamento:", response);
          throw new Error('Resposta inválida do servidor de pagamento');
        }
      } catch (error) {
        console.error('Erro ao gerar código PIX:', error);
        setStatus('error');
        setMessage('Não foi possível gerar o código PIX para pagamento.');
        toast.error("Erro ao gerar código PIX. Por favor, tente novamente.");
      }
    };

    // Start the checkout process
    initiateCheckout();
  }, [clearCart, items, orderId, email, shippingFee, discount, subtotal, total]);

  // Function to simulate payment confirmation (demo only)
  const handleSimulatePayment = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setMessage('Seu pagamento foi processado com sucesso!');
      clearCart();
      toast.success('Pagamento confirmado com sucesso!');
    }, 1500);
  };

  const handleDirectRedirect = () => {
    if (mercadoPagoUrl) {
      window.open(mercadoPagoUrl, '_blank');
    } else {
      toast.error("URL de pagamento não disponível");
    }
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
                {message || "Por favor, aguarde enquanto preparamos seu pagamento..."}
              </p>
            </div>
          )}

          {status === 'waiting' && (
            <div className="flex flex-col items-center py-8">
              <h2 className="text-xl font-bold mb-4">Pagamento via PIX</h2>
              
              {mercadoPagoUrl && (
                <Button 
                  onClick={handleDirectRedirect}
                  className="mb-4 w-full bg-[#009EE3] hover:bg-[#008CCD] text-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Pagar no Mercado Pago
                </Button>
              )}
              
              <QRCodeDisplay 
                pixCode={pixCode}
                isLoading={false}
                mercadoPagoUrl={mercadoPagoUrl}
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
              
              {/* Botão para simular pagamento confirmado (apenas para testes) */}
              <Button onClick={handleSimulatePayment} className="mt-2 w-full bg-green-600 hover:bg-green-700">
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
