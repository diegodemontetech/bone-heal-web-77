
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";

export const usePaymentStatusUpdate = () => {
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

  /**
   * Sincroniza um pedido pago com o Omie
   */
  const syncPaidOrderWithOmie = async (orderId: string, paymentData?: any) => {
    try {
      // 1. Buscar o pedido completo para ter todos os dados
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        console.error("Erro ao buscar detalhes do pedido para sincronizar com Omie:", orderError);
        throw orderError || new Error("Pedido não encontrado");
      }

      // 2. Verificar se o cliente possui código Omie
      if (!order.profiles?.omie_code) {
        console.warn("Cliente sem código Omie. Tentando sincronizar cliente primeiro...");
        await syncCustomerWithOmie(order.user_id);
      }

      // 3. Chamar função do Supabase para sincronizar o pedido com o Omie
      const { data: omieData, error: omieError } = await supabase.functions.invoke('sync-omie-order', {
        body: {
          order_id: orderId,
          payment_data: paymentData,
          is_paid: true
        }
      });

      if (omieError) {
        console.error("Erro ao sincronizar pedido pago com Omie:", omieError);
        
        // Obter os erros de sincronização atuais
        const currentErrors = parseJsonArray(order.omie_sync_errors, []);
        
        // Registrar erro de sincronização no pedido
        await supabase
          .from("orders")
          .update({
            omie_sync_errors: [
              ...currentErrors,
              {
                date: new Date().toISOString(),
                message: omieError.message || "Erro desconhecido",
                details: JSON.stringify(omieError)
              }
            ],
            omie_last_sync_attempt: new Date().toISOString()
          })
          .eq("id", orderId);
          
        throw omieError;
      }

      // 4. Atualizar pedido com dados retornados do Omie
      if (omieData?.omie_order_id) {
        await supabase
          .from('orders')
          .update({
            omie_order_id: omieData.omie_order_id,
            omie_status: "faturado",
            omie_last_update: new Date().toISOString(),
            omie_last_sync_attempt: new Date().toISOString()
          })
          .eq('id', orderId);
          
        console.log(`Pedido ${orderId} sincronizado com Omie. ID Omie: ${omieData.omie_order_id}`);
      }

      return { success: true, omie_data: omieData };
    } catch (error) {
      console.error("Erro ao sincronizar pedido pago com Omie:", error);
      return { success: false, error };
    }
  };

  /**
   * Sincroniza um cliente com o Omie caso ainda não esteja sincronizado
   */
  const syncCustomerWithOmie = async (userId: string) => {
    try {
      // Verificar se o cliente já está sincronizado
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("omie_code, omie_sync")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Erro ao verificar perfil de cliente:", profileError);
        throw profileError;
      }

      // Se já estiver sincronizado, não faz nada
      if (profile.omie_code && profile.omie_sync) {
        console.log(`Cliente ${userId} já está sincronizado com Omie. Código: ${profile.omie_code}`);
        return { success: true, already_synced: true };
      }

      // Sincronizar cliente com Omie
      const { data: omieData, error: omieError } = await supabase.functions.invoke('omie-customer', {
        body: { user_id: userId }
      });

      if (omieError) {
        console.error("Erro ao sincronizar cliente com Omie:", omieError);
        throw omieError;
      }

      // Se a sincronização foi bem-sucedida, atualizar o perfil
      if (omieData?.success && omieData?.omie_code) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            omie_code: omieData.omie_code,
            omie_sync: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);

        if (updateError) {
          console.error("Erro ao atualizar perfil após sincronização com Omie:", updateError);
          throw updateError;
        }

        console.log(`Cliente ${userId} sincronizado com Omie. Código: ${omieData.omie_code}`);
      }

      return { success: true, omie_data: omieData };
    } catch (error) {
      console.error("Erro ao sincronizar cliente com Omie:", error);
      return { success: false, error };
    }
  };

  return {
    updateOrderPaymentStatus,
    syncPaidOrderWithOmie,
    syncCustomerWithOmie
  };
};
