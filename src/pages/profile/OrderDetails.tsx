
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/hooks/auth/auth-context';
import OrderDetailsContent from '@/components/orders/details/OrderDetailsContent';
import OrderNotFound from '@/components/orders/details/OrderNotFound';
import OrderLoading from '@/components/orders/details/OrderLoading';

const ProfileOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuthContext();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id || !profile?.id) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('id', id)
        .eq('user_id', profile.id)
        .single();
        
      if (error) {
        console.error('Erro ao buscar pedido:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!id && !!profile?.id
  });

  if (isLoading) {
    return <OrderLoading />;
  }

  if (!order) {
    return <OrderNotFound />;
  }

  return <OrderDetailsContent order={order} />;
};

export default ProfileOrderDetails;
