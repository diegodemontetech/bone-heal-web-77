
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import OrderHeader from "@/components/orders/details/OrderHeader";
import OrderLoading from "@/components/orders/details/OrderLoading";
import OrderNotFound from "@/components/orders/details/OrderNotFound";
import OrderDetailsContent from "@/components/orders/details/OrderDetailsContent";
import OrderSummaryCard from "@/components/orders/details/OrderSummaryCard";
import { Order } from "@/types/order";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Verificar a sessão do usuário
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session?.user?.id) {
          toast.error("É necessário estar logado para visualizar os detalhes do pedido");
          navigate("/login", { state: { from: `/orders/${id}` } });
          return;
        }
        
        // Buscar detalhes do pedido
        const { data, error } = await supabase
          .from('orders')
          .select('*, payments(*)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          toast.error("Pedido não encontrado");
          navigate("/orders");
          return;
        }
        
        setOrder(data as unknown as Order);
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        toast.error("Erro ao carregar detalhes do pedido");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchOrderDetails();
    }
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 py-8 flex-1">
        <OrderHeader />
        
        {loading ? (
          <OrderLoading />
        ) : !order ? (
          <OrderNotFound />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <OrderDetailsContent order={order} />
            <OrderSummaryCard 
              subtotal={order.subtotal}
              shipping_fee={order.shipping_fee}
              discount={order.discount}
              total_amount={order.total_amount}
              status={order.status}
            />
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default OrderDetails;
