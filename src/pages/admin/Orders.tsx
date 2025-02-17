
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersList from "@/components/admin/OrdersList";
import CreateOrder from "@/components/admin/CreateOrder";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Orders = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  // Verificar se o usuário é admin
  const { data: profile, isLoading } = useQuery({
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

  useEffect(() => {
    // Se não estiver carregando e não for admin, redirecionar
    if (!isLoading && !profile?.is_admin) {
      navigate("/orders");
    }
  }, [isLoading, profile, navigate]);

  // Se ainda estiver carregando, não mostrar nada
  if (isLoading) {
    return null;
  }

  // Se não for admin, não mostrar nada (será redirecionado)
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

            <Tabs defaultValue="list" className="space-y-4">
              <TabsList>
                <TabsTrigger value="list">Lista de Pedidos</TabsTrigger>
                <TabsTrigger value="create" disabled={!isCreating}>
                  Criar Pedido
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                <OrdersList />
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
