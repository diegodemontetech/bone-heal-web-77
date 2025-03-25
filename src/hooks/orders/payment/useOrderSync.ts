
import { supabase } from "@/integrations/supabase/client";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";
import { useCustomerSync } from "./useCustomerSync";

/**
 * Hook for syncing orders with Omie
 */
export const useOrderSync = () => {
  const { syncCustomerWithOmie } = useCustomerSync();
  
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

  return {
    syncPaidOrderWithOmie,
  };
};
