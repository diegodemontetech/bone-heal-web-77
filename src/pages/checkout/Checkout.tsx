
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CheckoutLoader from "@/components/checkout/CheckoutLoader";
import PaymentTabs from "@/components/checkout/PaymentTabs";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

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
    return <CheckoutLoader />;
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
        preference_id: paymentData.id
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
                <PaymentTabs 
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  processPayment={processPayment}
                  isProcessing={isProcessing}
                  pixCode={pixCode}
                  pixQrCodeImage={pixQrCodeImage}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <CheckoutSummary 
              cartItems={cartItems}
              shippingInfo={shippingInfo}
              cartTotal={cartTotal}
            />
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Checkout;
