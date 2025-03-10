
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateOrder from "@/components/admin/CreateOrder";
import OrdersKanban from "@/components/admin/orders/OrdersKanban";

const Orders = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  // Verificar se o usuário é admin
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Buscar pedidos
  const { data: orders, isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
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
      return data;
    },
    enabled: !!profile?.is_admin,
  });

  if (profileLoading || ordersLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Gerenciamento de Pedidos</h1>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido
              </Button>
            </div>

            <Tabs defaultValue="kanban" className="space-y-4">
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="create" disabled={!isCreating}>
                  Criar Pedido
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kanban">
                <OrdersKanban orders={orders} refetchOrders={refetch} />
              </TabsContent>

              <TabsContent value="create">
                {isCreating && (
                  <CreateOrder onCancel={() => setIsCreating(false)} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Orders;
