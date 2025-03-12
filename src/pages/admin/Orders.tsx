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
import { OrderWithJson } from "@/hooks/admin/whatsapp/WhatsAppTypes";

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
        
        return (data as OrderWithJson[])?.map(order => {
          const parsedItems = parseJsonArray(order.items, []) as OrderItem[];
          const profileData = order.profiles || {};
          
          const shippingAddress: ShippingAddress = {
            zip_code: order.shipping_address?.zip_code || profileData.zip_code || '',
            city: order.shipping_address?.city || profileData.city || '',
            state: order.shipping_address?.state || profileData.state || '',
            address: order.shipping_address?.address || profileData.address || '',
            number: order.shipping_address?.number || profileData.endereco_numero || '',
            complement: order.shipping_address?.complement || profileData.complemento || '',
            neighborhood: order.shipping_address?.neighborhood || profileData.neighborhood || ''
          };
          
          return {
            ...order,
            payment_status: order.payment_status || 'pending',
            shipping_address: shippingAddress,
            items: parsedItems
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
