
import { supabase } from "@/integrations/supabase/client";

interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export const useOrderNotifications = () => {
  const createCustomerNotification = async (
    customerId: string,
    orderId: string
  ) => {
    try {
      await supabase
        .from("notifications")
        .insert({
          user_id: customerId,
          type: "payment",
          content: `Seu pedido #${orderId.slice(0, 8)} está aguardando pagamento.`,
          status: "pending"
        });
      return true;
    } catch (error) {
      console.warn("Erro ao criar notificação:", error);
      return false;
    }
  };

  const triggerWorkflow = async (
    orderId: string,
    customer: CustomerInfo,
    totalAmount: number,
    paymentMethod: string
  ) => {
    try {
      await supabase.functions.invoke('trigger-workflow', {
        body: {
          workflow: "pedido_criado",
          data: {
            order_id: orderId,
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            total: totalAmount,
            payment_link: `${window.location.origin}/checkout/${orderId}`,
            payment_method: paymentMethod
          }
        }
      });
      return true;
    } catch (n8nError) {
      console.warn("Erro ao disparar workflow:", n8nError);
      return false;
    }
  };

  return {
    createCustomerNotification,
    triggerWorkflow
  };
};
