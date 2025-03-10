
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Checkout = () => {
  const { cartItems, total: cartTotal, clear } = useCart();
  const { profile, isLoading: profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [pixQrCodeImage, setPixQrCodeImage] = useState("");
  
  // Obter informações de frete passadas do carrinho
  const shippingInfo = location.state?.shipping || null;

  useEffect(() => {
    // Verifica se tem itens no carrinho
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      navigate("/cart");
      return;
    }

    // Verifica se o usuário está logado
    if (!profile && !profileLoading) {
      toast.error("É necessário estar logado para acessar o checkout");
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [cartItems.length, profile, navigate, profileLoading]);

  // Se estiver carregando o perfil, mostrar loader
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando suas informações...</span>
      </div>
    );
  }

  // Função para processar o pagamento
  const processPayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Criar um ID de pedido único
      const orderId = crypto.randomUUID();
      
      // Preparar os itens para o MercadoPago
      const orderItems = cartItems.map(item => ({
        title: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      // Obter informações do comprador
      const buyerInfo = {
        name: profile?.full_name || '',
        email: profile?.email || ''
      };

      console.log("Dados para processamento:", {
        orderId,
        items: orderItems,
        shipping_cost: shippingInfo?.cost || 0,
        buyer: buyerInfo,
        paymentType: paymentMethod === 'standard' ? 'standard' : 'transparent'
      });

      // Chamar a Edge Function do MercadoPago
      const { data, error } = await supabase.functions.invoke("mercadopago-checkout", {
        body: {
          orderId,
          items: orderItems,
          shipping_cost: shippingInfo?.cost || 0,
          buyer: buyerInfo,
          paymentType: paymentMethod === 'standard' ? 'standard' : 'transparent'
        }
      });

      if (error) {
        console.error("Erro da Edge Function:", error);
        throw new Error(`Erro ao processar pagamento: ${error.message}`);
      }

      console.log("Resposta do MercadoPago:", data);

      // Registrar o pedido e pagamento no banco de dados
      await createOrderRecord(orderId, data);

      // Processar de acordo com o método de pagamento
      if (paymentMethod === 'standard') {
        // Redirecionar para checkout do MercadoPago
        window.location.href = data.init_point;
      } else if (paymentMethod === 'pix') {
        // Verificar se a resposta contém os dados do PIX
        if (data?.point_of_interaction?.transaction_data?.qr_code) {
          // Extrair os dados do PIX
          setPixCode(data.point_of_interaction.transaction_data.qr_code);
          setPixQrCodeImage(data.point_of_interaction.transaction_data.qr_code_base64);
          
          // Não redireciona automaticamente, deixa o usuário copiar o código PIX
          toast.success("PIX gerado com sucesso! Escaneie o QR code ou copie o código.");
        } else {
          console.error("Dados PIX não encontrados na resposta:", data);
          throw new Error("Dados do PIX não retornados pelo MercadoPago. Por favor, tente novamente ou escolha outro método de pagamento.");
        }
      } else if (paymentMethod === 'credit_card') {
        // Implementação futura para pagamento com cartão de crédito
        toast.info("Pagamento com cartão de crédito será implementado em breve");
      }

    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error(error.message || "Erro ao processar o pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para registrar o pedido no banco de dados
  const createOrderRecord = async (orderId, paymentData) => {
    try {
      // Criar registro de pedido
      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        user_id: profile?.id,
        status: 'pending',
        items: cartItems,
        shipping_address: {
          zip_code: shippingInfo?.zipCode || ''
        },
        shipping_fee: shippingInfo?.cost || 0,
        total_amount: cartTotal + (shippingInfo?.cost || 0)
      });

      if (orderError) throw orderError;

      // Criar registro de pagamento
      const { error: paymentError } = await supabase.from('payments').insert({
        order_id: orderId,
        user_id: profile?.id,
        amount: cartTotal + (shippingInfo?.cost || 0),
        status: 'pending',
        payment_method: paymentMethod,
        mercadopago_preference_id: paymentData.id
      });

      if (paymentError) throw paymentError;

    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      // Não interrompe o fluxo, apenas loga o erro
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Checkout</h1>
        </div>
        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pix" className="w-full" onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="pix" className="flex items-center">
                      <QrCode className="h-4 w-4 mr-2" />
                      <span>PIX</span>
                    </TabsTrigger>
                    <TabsTrigger value="credit_card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Cartão</span>
                    </TabsTrigger>
                    <TabsTrigger value="standard" className="flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      <span>Checkout MP</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pix">
                    <div className="space-y-4">
                      {pixCode ? (
                        <div className="flex flex-col items-center p-6 border rounded-md">
                          <h3 className="font-medium text-lg mb-4">Pagamento PIX gerado!</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Escaneie o QR code abaixo ou copie o código PIX:
                          </p>
                          
                          {pixQrCodeImage && (
                            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                              <img 
                                src={`data:image/png;base64,${pixQrCodeImage}`}
                                alt="QR Code PIX" 
                                className="h-48 w-48 mx-auto"
                              />
                            </div>
                          )}
                          
                          <div className="w-full p-3 bg-gray-100 rounded-md mb-4 text-center overflow-hidden">
                            <code className="text-xs break-all">{pixCode}</code>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              navigator.clipboard.writeText(pixCode);
                              toast.success("Código PIX copiado!");
                            }}
                          >
                            Copiar código PIX
                          </Button>
                          
                          <div className="mt-4 text-sm text-center text-green-600">
                            Após o pagamento, você receberá a confirmação e poderá acompanhar o pedido na área "Meus Pedidos".
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            O pagamento via PIX é rápido, seguro e sem taxas. Após clicar em "Finalizar compra", 
                            você receberá um QR code para escanear com seu aplicativo bancário.
                          </p>
                          
                          <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            O pagamento é processado instantaneamente após a confirmação do PIX.
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="credit_card">
                    <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                      <p className="text-yellow-800">
                        Pagamento com cartão de crédito será implementado em breve. Por favor, utilize outra forma de pagamento.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="standard">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Você será redirecionado para a página de pagamento do MercadoPago, onde poderá escolher entre diversas formas de pagamento.
                      </p>
                      
                      <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Após finalizar o pagamento no MercadoPago, você retornará automaticamente para nossa loja.
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <Button 
                    className="w-full h-12"
                    onClick={processPayment}
                    disabled={isProcessing || !!pixCode}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : pixCode ? (
                      <>Pagamento PIX gerado</>
                    ) : (
                      <>Finalizar compra</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>
                      {shippingInfo?.cost 
                        ? `R$ ${shippingInfo.cost.toFixed(2)}` 
                        : "Calculando..."}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      R$ {(cartTotal + (shippingInfo?.cost || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Checkout;
