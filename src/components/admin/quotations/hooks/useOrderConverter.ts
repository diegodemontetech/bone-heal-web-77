
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Interface para dados do cliente
interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  neighborhood?: string;
  cpf?: string;
}

// Interface para informações de frete
interface ShippingInfo {
  cost: number;
  method?: string;
  carrier?: string;
  estimated_days?: number;
  zipCode?: string;
  service_type?: string;
}

export const useOrderConverter = () => {
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);

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
      const enhancedItems = await Promise.all(quotationItems.map(async (item: any) => {
        if (item.product_id) {
          const { data: product } = await supabase
            .from("products")
            .select("*")
            .eq("id", item.product_id)
            .single();
          
          return {
            product_id: item.product_id,
            name: item.product_name || product?.name,
            quantity: item.quantity,
            price: item.unit_price || product?.price,
            omie_code: product?.omie_code || null,
            product_image: product?.main_image || product?.default_image_url
          };
        }
        
        return {
          product_id: item.product_id,
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price,
          omie_code: null
        };
      }));

      // Tratar informações do cliente com tipagem segura
      const customerInfoRaw = quotation.customer_info as Json;
      if (!customerInfoRaw || typeof customerInfoRaw !== 'object') {
        throw new Error("Informações do cliente inválidas");
      }
      
      const customer: CustomerInfo = {
        id: '',
        name: ''
      };
      
      // Extrair dados do cliente com segurança
      if (typeof customerInfoRaw === 'object' && customerInfoRaw !== null && !Array.isArray(customerInfoRaw)) {
        const customerObj = customerInfoRaw as Record<string, Json>;
        customer.id = customerObj.id as string || '';
        customer.name = customerObj.name as string || '';
        customer.email = customerObj.email as string | undefined;
        customer.phone = customerObj.phone as string | undefined;
        customer.address = customerObj.address as string | undefined;
        customer.city = customerObj.city as string | undefined;
        customer.state = customerObj.state as string | undefined;
        customer.zip_code = customerObj.zip_code as string | undefined;
        customer.neighborhood = customerObj.neighborhood as string | undefined;
        customer.cpf = customerObj.cpf as string | undefined;
      }

      if (!customer.id || !customer.name) {
        throw new Error("Cliente não encontrado para este orçamento");
      }

      // Dados do endereço para entrega
      const shippingAddress = {
        name: customer.name,
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip_code: customer.zip_code || '',
        neighborhood: customer.neighborhood || ''
      };

      // Extrair informações de frete com segurança
      const shippingInfoRaw = quotation.shipping_info as Json;
      const shippingInfo: ShippingInfo = {
        cost: 0
      };
      
      if (shippingInfoRaw && typeof shippingInfoRaw === 'object' && !Array.isArray(shippingInfoRaw)) {
        const shippingObj = shippingInfoRaw as Record<string, Json>;
        shippingInfo.cost = typeof shippingObj.cost === 'number' ? shippingObj.cost : 
                            typeof shippingObj.cost === 'string' ? parseFloat(shippingObj.cost) : 0;
        shippingInfo.method = shippingObj.method as string | undefined;
        shippingInfo.carrier = shippingObj.carrier as string | undefined;
        shippingInfo.estimated_days = shippingObj.estimated_days as number | undefined;
        shippingInfo.service_type = shippingObj.service_type as string | undefined;
        shippingInfo.zipCode = shippingObj.zip_code as string | undefined;
      }

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
      const mpItems = enhancedItems.map(item => ({
        title: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      try {
        console.log("Criando preferência de pagamento...");
        const { data: prefData, error: prefError } = await supabase.functions.invoke(
          'mercadopago-checkout',
          {
            body: {
              orderId: order.id,
              items: mpItems,
              shipping_cost: shippingInfo.cost || 0,
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
        } else if (prefData?.id) {
          // Atualizar o pedido com a preferência do MP
          await supabase
            .from("orders")
            .update({
              mp_preference_id: prefData.id
            })
            .eq("id", order.id);
          
          console.log("Preferência MP criada:", prefData.id);
          
          // Criar notificação para o cliente
          await supabase
            .from("notifications")
            .insert({
              user_id: customer.id,
              type: "payment",
              content: `Seu pedido #${order.id.slice(0, 8)} está aguardando pagamento.`,
              status: "pending"
            });
          
          // Disparar webhook para o n8n (se estiver configurado)
          try {
            await supabase.functions.invoke('trigger-workflow', {
              body: {
                workflow: "pedido_criado",
                data: {
                  order_id: order.id,
                  customer_name: customer.name,
                  customer_email: customer.email,
                  customer_phone: customer.phone,
                  total: order.total_amount,
                  payment_link: `${window.location.origin}/checkout/${order.id}`,
                  payment_method: order.payment_method
                }
              }
            });
          } catch (n8nError) {
            console.warn("Erro ao disparar workflow:", n8nError);
          }
        }
      } catch (mpError) {
        console.warn("Erro ao processar pagamento:", mpError);
      }

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
