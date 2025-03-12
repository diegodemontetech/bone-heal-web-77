
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Package, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { parseJsonArray, parseJsonObject } from "@/utils/supabaseJsonUtils";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

interface OrderAddress {
  zip_code: string;
  city: string;
  state: string;
  address: string;
}

interface OrderProfile {
  zip_code?: string;
  city?: string;
  state?: string;
  address?: string;
  [key: string]: any;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  payment_method: string;
  payment_status: string;
  items: OrderItem[];
  shipping_address: OrderAddress;
  created_at: string;
  updated_at: string;
  discount: number;
  profiles?: OrderProfile;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
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
        const formattedOrders: Order[] = data.map(order => {
          // Parse JSON fields
          const parsedItems = parseJsonArray(order.items, []);
          const profileData: OrderProfile = order.profiles || {};
          
          // Cria um objeto de endereço com valores padrão
          const shippingAddress: OrderAddress = {
            zip_code: profileData?.zip_code || '',
            city: profileData?.city || '',
            state: profileData?.state || '',
            address: profileData?.address || ''
          };
          
          return {
            id: order.id,
            user_id: order.user_id,
            status: order.status,
            total_amount: order.total_amount,
            subtotal: order.subtotal || 0,
            shipping_fee: order.shipping_fee || 0,
            payment_method: order.payment_method,
            payment_status: order.payment_status || 'pending',
            items: parsedItems.map((item: any) => ({
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Em processamento</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 py-8 flex-1">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Meus Pedidos</h1>
        </div>
        <Separator className="mb-8" />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Carregando seus pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center">
                <Package className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Você ainda não tem pedidos</h3>
                <p className="text-gray-600 mb-6">
                  Visite nossa loja e faça seu primeiro pedido
                </p>
                <Button 
                  className="bg-primary text-white"
                  onClick={() => navigate("/products")}
                >
                  Ver Produtos
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id.substring(0, 8)}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {order.items?.length || 0} item(s) • R$ {parseFloat(order.total_amount.toString()).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Pagamento: {order.payment_method === 'pix' ? 'PIX' : 
                                    order.payment_method === 'credit' ? 'Cartão de Crédito' : 
                                    order.payment_method === 'boleto' ? 'Boleto' : order.payment_method}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Orders;
