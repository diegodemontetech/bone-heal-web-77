
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import OrdersKanban from "@/components/admin/orders/OrdersKanban";
import CreateOrder from "@/components/admin/CreateOrder";

const Orders = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");

  // Buscar pedidos
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

        if (error) {
          console.error("Erro ao buscar pedidos:", error);
          throw error;
        }
        
        console.log("Pedidos carregados:", data);
        return data || [];
      } catch (err) {
        console.error("Erro na consulta de pedidos:", err);
        throw err;
      }
    },
  });

  // Exibir erros com toast
  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar pedidos. Por favor, tente novamente.");
      console.error("Erro detalhado:", error);
    }
  }, [error]);

  // Mudar para a tab de criação quando clicar no botão
  useEffect(() => {
    if (isCreating) {
      setActiveTab("create");
    }
  }, [isCreating]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciamento de Pedidos</h1>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Pedido
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="create" disabled={!isCreating}>
                Criar Pedido
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kanban">
              {error ? (
                <div className="text-center py-16 bg-red-50 rounded-md">
                  <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-medium">Erro ao carregar pedidos</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => refetch()}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : orders && orders.length > 0 ? (
                <OrdersKanban orders={orders} refetchOrders={refetch} />
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-md">
                  <p className="text-gray-500">Nenhum pedido encontrado</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsCreating(true)}
                  >
                    Criar novo pedido
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
