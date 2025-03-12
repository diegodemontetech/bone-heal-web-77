
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { OrderDetails } from "@/components/admin/order/OrderDetails";
import OrdersHeader from "@/components/admin/orders/OrdersHeader";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";
import OrdersLoading from "@/components/admin/orders/OrdersLoading";
import { Order, OrderItem, ShippingAddress } from "@/types/order";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";

const Orders = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            profiles:user_id (
              full_name,
              phone,
              zip_code,
              omie_code
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        return data?.map(order => {
          const parsedItems = parseJsonArray(order.items, []) as OrderItem[];
          const profileData = order.profiles || {};
          
          // Definir um objeto de endereço de envio padrão para evitar erros
          const shippingAddress: ShippingAddress = {
            zip_code: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.zip_code || '') : 
              String(profileData.zip_code || ''),
            city: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.city || '') : 
              String(profileData.city || ''),
            state: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.state || '') : 
              String(profileData.state || ''),
            address: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.address || '') : 
              String(profileData.address || ''),
            number: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.number || '') : 
              String(profileData.endereco_numero || ''),
            complement: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.complement || '') : 
              String(profileData.complemento || ''),
            neighborhood: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.neighborhood || '') : 
              String(profileData.neighborhood || '')
          };
          
          return {
            ...order,
            payment_status: order.payment_status || 'pending',
            shipping_address: shippingAddress,
            items: parsedItems,
            profiles: profileData
          } as unknown as Order;
        }) as Order[];
      } catch (err) {
        console.error("Erro na consulta de pedidos:", err);
        throw err;
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar pedidos. Por favor, tente novamente.");
      console.error("Erro detalhado:", error);
    }
  }, [error]);

  useEffect(() => {
    if (isCreating) {
      setActiveTab("create");
    }
  }, [isCreating]);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    return <OrdersLoading />;
  }

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <OrdersHeader setIsCreating={setIsCreating} />
          
          <OrdersTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            orders={orders}
            error={error}
            refetch={refetch}
            onViewOrder={handleViewOrder}
          />
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;
