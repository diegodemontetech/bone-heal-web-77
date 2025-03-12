
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { OrderDetails } from "@/components/admin/order/OrderDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersKanban from "@/components/admin/orders/OrdersKanban";
import { OrdersList } from "@/components/admin/orders/OrdersList";
import OrdersHeader from "@/components/admin/orders/OrdersHeader";
import OrdersLoading from "@/components/admin/orders/OrdersLoading";
import EmptyOrdersMessage from "@/components/admin/orders/EmptyOrdersMessage";
import OrdersErrorMessage from "@/components/admin/orders/OrdersErrorMessage";
import CreateOrder from "@/components/admin/CreateOrder";
import { Order } from "@/types/order";
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
        
        return data?.map(order => ({
          ...order,
          payment_status: order.payment_status || 'pending',
          items: parseJsonArray(order.items, []),
          shipping_address: order.shipping_address || {}
        })) as Order[];
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    return <OrdersLoading />;
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <OrdersHeader setIsCreating={setIsCreating} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="create" disabled={!isCreating}>
              Novo Pedido
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            {error ? (
              <OrdersErrorMessage refetch={refetch} />
            ) : orders && orders.length > 0 ? (
              <OrdersKanban 
                orders={orders} 
                refetchOrders={refetch}
                onViewOrder={handleViewOrder}
              />
            ) : (
              <EmptyOrdersMessage setIsCreating={setIsCreating} />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {orders && orders.length > 0 ? (
              <OrdersList orders={orders} onViewOrder={handleViewOrder} />
            ) : (
              <EmptyOrdersMessage setIsCreating={setIsCreating} />
            )}
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            {isCreating && (
              <CreateOrder
                onCancel={() => {
                  setIsCreating(false);
                  setActiveTab("kanban");
                }}
              />
            )}
          </TabsContent>
        </Tabs>
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
