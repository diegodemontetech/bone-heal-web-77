
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersList from "@/components/orders/OrdersList";
import OrdersLoading from "@/components/orders/OrdersLoading";
import OrdersEmpty from "@/components/orders/OrdersEmpty";
import { toast } from "sonner";
import { parseJsonArray, parseJsonObject } from "@/utils/supabaseJsonUtils";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Verificar a sessão do usuário
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session?.user?.id) {
          toast.error("É necessário estar logado para visualizar seus pedidos");
          navigate("/login", { state: { from: "/orders" } });
          return;
        }
        
        // Buscar pedidos do usuário
        const { data, error } = await supabase
          .from('orders')
          .select('*, profiles:user_id(*)')
          .eq('user_id', sessionData.session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (!data) {
          setOrders([]);
          return;
        }

        // Converter os dados para o formato esperado
        const formattedOrders = data.map(order => {
          // Parse JSON fields
          const parsedItems = parseJsonArray(order.items, []);
          const profileData = order.profiles || {};
          
          // Cria um objeto de endereço com valores padrão
          const shippingAddress = {
            zip_code: profileData?.zip_code || '',
            city: profileData?.city || '',
            state: profileData?.state || '',
            address: profileData?.address || ''
          };
          
          return {
            id: order.id,
            user_id: order.user_id,
            status: order.status || 'pending',
            total_amount: order.total_amount,
            subtotal: order.subtotal || 0,
            shipping_fee: order.shipping_fee || 0,
            payment_method: order.payment_method,
            payment_status: order.payment_status || 'pending',
            items: parsedItems.map((item) => ({
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity,
              price: item.price,
              total_price: item.total_price
            })),
            shipping_address: shippingAddress,
            created_at: order.created_at,
            updated_at: order.updated_at || order.created_at,
            discount: order.discount || 0,
            profiles: profileData
          };
        });
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 py-8 flex-1">
        <OrdersHeader />
        
        {loading ? (
          <OrdersLoading />
        ) : orders.length === 0 ? (
          <OrdersEmpty navigate={navigate} />
        ) : (
          <OrdersList orders={orders} navigate={navigate} />
        )}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Orders;
