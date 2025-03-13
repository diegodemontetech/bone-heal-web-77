
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrderActions = (refetchOrders: () => void) => {
  const [syncingOrder, setSyncingOrder] = useState<string | null>(null);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ omie_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      refetchOrders();
      toast.success('Status atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const syncOrderWithOmie = async (orderId: string) => {
    try {
      setSyncingOrder(orderId);
      toast.loading('Sincronizando pedido com Omie...');
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        throw new Error(`Erro ao buscar pedido: ${orderError?.message || 'Pedido não encontrado'}`);
      }

      console.log('Dados do pedido encontrados:', order);

      if (!order.profiles) {
        throw new Error('Perfil do cliente não encontrado para o pedido');
      }

      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        throw new Error('Pedido não possui itens');
      }

      // Buscar dados completos dos produtos
      const items = await Promise.all(
        order.items.map(async (item: any) => {
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', item.product_id)
            .single();
          
          if (productError || !product) {
            throw new Error(`Produto não encontrado: ${item.product_id}`);
          }
          
          if (!product.omie_code) {
            throw new Error(`Produto ${product.name} não possui código Omie`);
          }
          
          return {
            ...item,
            omie_code: product.omie_code,
            name: product.name,
            price: product.price
          };
        })
      );

      // Preparar payload para a edge function
      const payload = {
        action: 'sync_order',
        order_id: orderId,
        order_data: {
          id: order.id,
          items: items,
          total_amount: order.total_amount,
          profiles: order.profiles
        }
      };

      console.log('Payload para sincronização:', payload);

      const { data: responseData, error: integrationError } = await supabase.functions.invoke(
        'omie-integration',
        {
          body: payload
        }
      );

      if (integrationError) {
        throw new Error(`Erro na integração: ${integrationError.message}`);
      }

      if (!responseData?.success) {
        throw new Error(responseData?.error || 'Erro desconhecido na sincronização');
      }

      // Atualizar status do pedido
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          omie_status: 'sincronizado',
          omie_order_id: responseData.omie_order_id,
          omie_last_update: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        throw new Error(`Erro ao atualizar status do pedido: ${updateError.message}`);
      }

      toast.dismiss();
      toast.success('Pedido sincronizado com sucesso');
      refetchOrders();
    } catch (error: any) {
      console.error('Erro ao sincronizar pedido:', error);
      toast.dismiss();
      toast.error(`Erro ao sincronizar pedido: ${error.message}`);
    } finally {
      setSyncingOrder(null);
    }
  };

  // Adicionar funções para atualizar status para faturado e entregue
  const updateOrderInvoiced = async (orderId: string) => {
    // Esta função seria chamada quando o pedido é faturado no Omie
    await handleUpdateOrderStatus(orderId, 'faturado');
  };

  const updateOrderDelivered = async (orderId: string) => {
    // Esta função seria chamada quando o pedido é marcado como entregue no Omie
    await handleUpdateOrderStatus(orderId, 'entregue');
  };

  return {
    syncingOrder,
    handleUpdateOrderStatus,
    syncOrderWithOmie,
    updateOrderInvoiced,
    updateOrderDelivered
  };
};
