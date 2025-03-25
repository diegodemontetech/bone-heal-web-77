
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOrderSync } from "./useOrderSync";

/**
 * Hook for updating payment status in orders
 */
export const usePaymentUpdater = () => {
  const { syncPaidOrderWithOmie } = useOrderSync();

  /**
   * Atualiza o status de pagamento do pedido quando o webhook do MercadoPago notifica
   */
  const updateOrderPaymentStatus = async (orderId: string, status: string, paymentData?: any) => {
    try {
      console.log(`Atualizando status do pedido ${orderId} para ${status}`);

      // 1. Atualizar o status do pedido na tabela orders
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          payment_status: status,
          status: status === 'completed' ? 'processing' : (status === 'failed' ? 'cancelled' : 'pending'),
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (orderError) {
        console.error("Erro ao atualizar status do pedido:", orderError);
        throw orderError;
      }

      // 2. Atualizar ou criar registro na tabela payments
      const { error: paymentError } = await supabase
        .from("payments")
        .upsert({
          order_id: orderId,
          status: status,
          amount: paymentData?.amount,
          payment_method: paymentData?.payment_method || 'unknown',
          provider_payment_id: paymentData?.provider_payment_id,
          updated_at: new Date().toISOString()
        });

      if (paymentError) {
        console.error("Erro ao atualizar registro de pagamento:", paymentError);
        throw paymentError;
      }

      // 3. Se pagamento for completado, sincronizar com o Omie
      if (status === 'completed') {
        await syncPaidOrderWithOmie(orderId, paymentData);
      }

      return { success: true };
    } catch (error) {
      console.error("Erro ao processar atualização de status de pagamento:", error);
      toast.error("Falha ao atualizar status do pagamento");
      return { success: false, error };
    }
  };

  return {
    updateOrderPaymentStatus
  };
};
