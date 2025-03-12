
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrderConverter = () => {
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);

  const convertToOrder = async (quotationId: string) => {
    setIsConvertingToOrder(true);
    try {
      // Buscar os dados do orçamento
      const { data: quotation, error } = await supabase
        .from("quotations")
        .select("*, customer:profiles(*)")
        .eq("id", quotationId)
        .single();

      if (error) throw error;

      // Verificar se já foi convertido
      if (quotation.status === "converted") {
        toast.error("Este orçamento já foi convertido em pedido");
        return null;
      }

      // Buscar informações completas dos produtos
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

      const customer = Array.isArray(quotation.customer) 
        ? (quotation.customer.length > 0 ? quotation.customer[0] : null) 
        : quotation.customer;

      if (!customer) {
        throw new Error("Cliente não encontrado para este orçamento");
      }

      // Criar o pedido baseado no orçamento
      const orderData = {
        user_id: customer.id,
        items: enhancedItems,
        subtotal: quotation.subtotal_amount,
        total_amount: quotation.total_amount,
        discount: quotation.discount_amount,
        payment_method: quotation.payment_method,
        status: "pending",
        omie_status: "novo",
        shipping_address: {
          name: customer.full_name,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zip_code,
          neighborhood: customer.neighborhood
        }
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

      // Criar preferência no MercadoPago se necessário
      if (quotation.payment_method && order.id) {
        try {
          const { data: prefData, error: prefError } = await supabase.functions.invoke(
            'mercadopago-checkout',
            {
              body: {
                order_id: order.id,
                items: enhancedItems,
                payer: {
                  name: customer.full_name || "Cliente",
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
          } else if (prefData?.preferenceId) {
            await supabase
              .from("orders")
              .update({
                mp_preference_id: prefData.preferenceId
              })
              .eq("id", order.id);
          }
        } catch (mpError) {
          console.warn("Erro ao processar pagamento:", mpError);
        }
      }

      // Atualizar o status do orçamento para "converted"
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
