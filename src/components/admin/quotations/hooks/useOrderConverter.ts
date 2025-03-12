
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOrderItems } from "./converter/useOrderItems";
import { useCustomerExtractor } from "./converter/useCustomerExtractor";
import { useShippingExtractor } from "./converter/useShippingExtractor";
import { useMercadoPagoPreference } from "./converter/useMercadoPagoPreference";
import { useOrderNotifications } from "./converter/useOrderNotifications";

export const useOrderConverter = () => {
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);
  
  // Importar hooks especializados
  const { prepareOrderItems } = useOrderItems();
  const { extractCustomerInfo, buildShippingAddress } = useCustomerExtractor();
  const { extractShippingInfo } = useShippingExtractor();
  const { createMercadoPagoPreference } = useMercadoPagoPreference();
  const { createCustomerNotification, triggerWorkflow } = useOrderNotifications();

  const convertToOrder = async (quotationId: string) => {
    setIsConvertingToOrder(true);
    
    try {
      // Buscar os dados do orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*, customer_info")
        .eq("id", quotationId)
        .single();

      if (error) throw error;

      // Verificar se já foi convertido
      if (quotation.status === "converted") {
        toast.error("Este orçamento já foi convertido em pedido");
        return null;
      }

      // Preparar os itens para o pedido
      const quotationItems = Array.isArray(quotation.items) ? quotation.items : [];
      const enhancedItems = await prepareOrderItems(quotationItems);

      // Extrair informações do cliente
      const customer = extractCustomerInfo(quotation.customer_info);
      const shippingAddress = buildShippingAddress(customer);

      // Extrair informações de frete
      const shippingInfo = extractShippingInfo(quotation.shipping_info);

      // Criar o pedido
      const orderData = {
        user_id: customer.id,
        items: enhancedItems,
        subtotal: quotation.subtotal_amount,
        total_amount: quotation.total_amount,
        discount: quotation.discount_amount,
        shipping_fee: shippingInfo.cost || 0,
        payment_method: quotation.payment_method,
        status: "pending",
        omie_status: "novo",
        shipping_address: shippingAddress
      };

      // Inserir o novo pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        console.error("Erro detalhado ao converter:", orderError);
        throw new Error(`Erro ao inserir pedido: ${orderError.message}`);
      }

      // Criar preferência no MercadoPago
      await createMercadoPagoPreference(
        order.id,
        enhancedItems,
        shippingInfo.cost || 0,
        customer
      );
      
      // Criar notificação para o cliente
      await createCustomerNotification(customer.id, order.id);
      
      // Disparar webhook para o n8n
      await triggerWorkflow(
        order.id,
        customer,
        order.total_amount,
        order.payment_method
      );

      // Atualizar o status do orçamento
      const { error: updateError } = await supabase
        .from("quotations")
        .update({ status: "converted" })
        .eq("id", quotationId);

      if (updateError) throw updateError;

      toast.success("Orçamento convertido em pedido com sucesso");
      return order;
    } catch (error: any) {
      console.error("Erro ao converter orçamento em pedido:", error);
      toast.error(`Erro ao converter orçamento: ${error.message || "Erro desconhecido"}`);
      return null;
    } finally {
      setIsConvertingToOrder(false);
    }
  };

  return {
    isConvertingToOrder,
    convertToOrder
  };
};
