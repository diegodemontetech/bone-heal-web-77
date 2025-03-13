
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
      
      // Garantir que todos os pedidos tenham a propriedade payment_status
      return (data || []).map(order => ({
        ...order,
        payment_status: order.payment_status || 'pending'
      }));
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
