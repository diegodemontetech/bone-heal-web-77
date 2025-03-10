
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";
import { CartItem } from "@/hooks/use-cart";

interface PaymentProcessorProps {
  cartItems: CartItem[];
  total: number;
  profile: UserProfile | null;
  shippingInfo: {
    zipCode?: string;
    cost?: number;
  } | null;
  paymentMethod: string;
  setPixCode: (code: string) => void;
  setPixQrCodeImage: (image: string) => void;
}

export const usePaymentProcessor = ({
  cartItems,
  total,
  profile,
  shippingInfo,
  paymentMethod,
  setPixCode,
  setPixQrCodeImage
}: PaymentProcessorProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

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

    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      toast.error(error.message || "Erro ao processar o pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para registrar o pedido no banco de dados
  const createOrderRecord = async (orderId: string, paymentData: any) => {
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
        total_amount: total + (shippingInfo?.cost || 0)
      });

      if (orderError) throw orderError;

      // Criar registro de pagamento
      const { error: paymentError } = await supabase.from('payments').insert({
        order_id: orderId,
        user_id: profile?.id,
        amount: total + (shippingInfo?.cost || 0),
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

  return { processPayment, isProcessing };
};
