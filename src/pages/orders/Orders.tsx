
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
import { parseJsonArray } from "@/utils/supabaseJsonUtils";
import { Order, ShippingAddress, OrderItem } from "@/types/order";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData?.session?.user?.id) {
          toast.error("É necessário estar logado para visualizar seus pedidos");
          navigate("/login", { state: { from: "/orders" } });
          return;
        }
        
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

        const formattedOrders = data.map(order => {
          const parsedItems = parseJsonArray(order.items, []);
          const profileData = order.profiles || {};
          
          const shippingAddress: ShippingAddress = {
            zip_code: profileData.zip_code || '',
            city: profileData.city || '',
            state: profileData.state || '',
            address: profileData.address || '',
            number: profileData.endereco_numero || '',
            complement: profileData.complemento || '',
            neighborhood: profileData.neighborhood || ''
          };
          
          return {
            ...order,
            payment_status: order.payment_status || 'pending',
            shipping_address: shippingAddress,
            items: parsedItems.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              product_name: item.product_name,
              name: item.product_name || item.name || '',
              total_price: item.total_price
            })) as OrderItem[]
          } as Order;
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
