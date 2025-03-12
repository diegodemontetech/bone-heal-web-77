
import { supabase } from "@/integrations/supabase/client";

interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  cpf?: string;
  phone?: string;
}

export const useMercadoPagoPreference = () => {
  const createMercadoPagoPreference = async (
    orderId: string,
    items: any[],
    shippingCost: number,
    customer: CustomerInfo
  ) => {
    try {
      const mpItems = items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      console.log("Criando preferência de pagamento...");
      const { data: prefData, error: prefError } = await supabase.functions.invoke(
        'mercadopago-checkout',
        {
          body: {
            orderId: orderId,
            items: mpItems,
            shipping_cost: shippingCost || 0,
            buyer: {
              name: customer.name || "Cliente",
              email: customer.email || "cliente@example.com",
              identification: {
                type: "CPF",
                number: customer.cpf || "00000000000"
              }
            }
          }
        }
      );

      if (prefError) {
        console.warn("Erro ao criar preferência MP:", prefError);
        return null;
      } 
      
      if (prefData?.id) {
        // Atualizar o pedido com a preferência do MP
        await supabase
          .from("orders")
          .update({
            mp_preference_id: prefData.id
          })
          .eq("id", orderId);
        
        console.log("Preferência MP criada:", prefData.id);
        return prefData.id;
      }
      
      return null;
    } catch (mpError) {
      console.warn("Erro ao processar pagamento:", mpError);
      return null;
    }
  };

  return { createMercadoPagoPreference };
};
