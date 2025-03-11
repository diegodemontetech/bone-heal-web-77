
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { OrderDetails } from "@/components/admin/order/OrderDetails";
import OrdersHeader from "@/components/admin/orders/OrdersHeader";
import OrdersTabs from "@/components/admin/orders/OrdersTabs";
import OrdersLoading from "@/components/admin/orders/OrdersLoading";

const Orders = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
