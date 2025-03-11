
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
        .select("*")
        .eq("id", quotationId)
        .single();

      if (error) throw error;

      // Verificar se já foi convertido
      if (quotation.status === "converted") {
        toast.error("Este orçamento já foi convertido em pedido");
        return null;
      }

      // Criar o pedido baseado no orçamento - corrigindo para o esquema correto
      const orderData = {
        user_id: quotation.user_id,
        items: quotation.items,
        subtotal: quotation.subtotal_amount,
        total_amount: quotation.total_amount,
        discount: quotation.discount_amount,
        payment_method: quotation.payment_method,
        status: "pending",
        shipping_address: quotation.customer_info ? {
          name: quotation.customer_info.name,
          address: quotation.customer_info.address,
          city: quotation.customer_info.city,
          state: quotation.customer_info.state
        } : null
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
