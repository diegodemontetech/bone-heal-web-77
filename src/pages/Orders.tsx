
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Order, ShippingAddress } from "@/types/order";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersList from "@/components/orders/OrdersList";
import OrdersLoading from "@/components/orders/OrdersLoading";
import OrdersEmpty from "@/components/orders/OrdersEmpty";

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
          
          // Definir um objeto de endereço de envio padrão para evitar erros
          const shippingAddress: ShippingAddress = {
            zip_code: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.zip_code || '') : 
              String(profileData.zip_code || ''),
            city: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.city || '') : 
              String(profileData.city || ''),
            state: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.state || '') : 
              String(profileData.state || ''),
            address: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.address || '') : 
              String(profileData.address || ''),
            number: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.number || '') : 
              String(profileData.endereco_numero || ''),
            complement: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.complement || '') : 
              String(profileData.complemento || ''),
            neighborhood: typeof order.shipping_address === 'object' && order.shipping_address ? 
              String(order.shipping_address.neighborhood || '') : 
              String(profileData.neighborhood || '')
          };
          
          return {
            ...order,
            payment_status: order.payment_status || 'pending',
            shipping_address: shippingAddress,
            items: parsedItems.map((item: any) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              name: item.product_name || item.name || '',
              total_price: item.total_price
            }))
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
