
import React from 'react';
import { useAuthContext } from '@/hooks/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrdersList from '@/components/orders/OrdersList';
import OrdersHeader from '@/components/orders/OrdersHeader';
import OrdersEmpty from '@/components/orders/OrdersEmpty';
import OrdersLoading from '@/components/orders/OrdersLoading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Order, OrderItem, ShippingAddress } from '@/types/order';
import { parseJsonArray, parseJsonObject } from '@/utils/supabaseJsonUtils';

const ProfileOrders = () => {
  const { profile, isLoading: isAuthLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Converter os dados e garantir que todos os pedidos tenham a propriedade payment_status e items processados
      return (data || []).map((order) => {
        // Processar os items para garantir que são do tipo OrderItem[]
        const processedItems = parseJsonArray(order.items, []).map((item: any) => ({
          product_id: item.product_id || "",
          quantity: item.quantity || 0,
          price: item.price || 0,
          name: item.name || item.product_name || "Produto",
          product_name: item.product_name || item.name || "Produto",
          total_price: item.total_price || (item.price * item.quantity) || 0
        } as OrderItem));
        
        // Processar shipping_address para garantir que é do tipo ShippingAddress
        const shippingAddress: ShippingAddress = parseJsonObject(order.shipping_address, {
          zip_code: "",
          city: "",
          state: "",
          address: ""
        });
        
        return {
          ...order,
          payment_status: order.payment_status || 'pending',
          items: processedItems,
          shipping_address: shippingAddress
        } as Order;
      });
    },
    enabled: !!profile?.id
  });

  if (isAuthLoading || isLoading) {
    return <OrdersLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Meus Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersHeader />
          
          {orders && orders.length > 0 ? (
            <OrdersList orders={orders} navigate={navigate} />
          ) : (
            <OrdersEmpty navigate={navigate} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOrders;
