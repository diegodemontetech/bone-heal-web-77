
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Order } from "@/types/order";
import OrdersHeader from "@/components/admin/orders/OrdersHeader";
import OrdersKanban from "@/components/admin/orders/OrdersKanban";
import { OrdersList } from "@/components/admin/orders/OrdersList";
import OrdersLoading from "@/components/admin/orders/OrdersLoading";
import EmptyOrdersMessage from "@/components/admin/orders/EmptyOrdersMessage";
import OrdersErrorMessage from "@/components/admin/orders/OrdersErrorMessage";
import CreateOrder from "@/components/admin/CreateOrder";
import { OrderDetails } from "@/components/admin/order/OrderDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";
import { useAuth } from "@/hooks/use-auth-context";

const Orders = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      try {
        // Verificar se o usuário é admin antes de fazer a consulta
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          toast.error("Você precisa estar autenticado");
          navigate("/admin/login");
          return [];
        }
        
        // Verificar permissões diretamente no frontend
        const { data: profileData } = await supabase
          .from("profiles")
          .select("is_admin, role")
          .eq("id", session.session.user.id)
          .single();
          
        const hasAdminPermission = 
          profileData?.is_admin === true || 
          profileData?.role === 'admin' || 
          profileData?.role === 'admin_master';
          
        if (!hasAdminPermission) {
          toast.error("Você não tem permissão para ver os pedidos");
          return [];
        }

        // Buscar pedidos apenas se tiver permissão
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
        
        return data.map((order: any) => ({
          ...order,
          payment_status: order.payment_status || 'pending',
          items: parseJsonArray(order.items, []),
          shipping_address: order.shipping_address || {},
          omie_status: order.omie_status || 'novo'
        })) as Order[];
      } catch (err) {
        console.error("Erro na consulta de pedidos:", err);
        throw err;
      }
    },
    enabled: isAdmin, // Só executa a query se o usuário for admin
    refetchOnWindowFocus: false, // Evita recarregar os dados toda vez que a janela ganhar foco
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

  // Retorna null se não for admin para prevenir renderização do conteúdo
  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return <OrdersLoading />;
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 bg-white shadow-sm border border-gray-100">
        <OrdersHeader setIsCreating={setIsCreating} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="kanban" 
              className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger 
              value="list"
              className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm" 
            >
              Lista
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              disabled={!isCreating}
              className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
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
