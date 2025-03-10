
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, ChevronLeft, Truck, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
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
        
        setOrder(data);
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 py-8 flex-1">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate("/orders")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Detalhes do Pedido</h1>
        </div>
        <Separator className="mb-8" />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Carregando detalhes do pedido...</p>
          </div>
        ) : !order ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center">
                <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Pedido não encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Não conseguimos encontrar o pedido solicitado
                </p>
                <Button 
                  className="bg-primary text-white"
                  onClick={() => navigate("/orders")}
                >
                  Ver Meus Pedidos
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Pedido #{order.id.substring(0, 8)}</span>
                    {getStatusBadge(order.status)}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Realizado em {formatDate(order.created_at)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Status</h3>
                        <p className="text-sm text-gray-600">
                          {order.status === 'pending' ? 'Aguardando pagamento' :
                           order.status === 'processing' ? 'Em processamento' :
                           order.status === 'completed' ? 'Concluído' :
                           order.status === 'cancelled' ? 'Cancelado' : order.status}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Envio</h3>
                        <p className="text-sm text-gray-600">
                          Endereço: CEP {order.shipping_address?.zip_code || "Não informado"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Frete: R$ {order.shipping_fee?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Pagamento</h3>
                        <p className="text-sm text-gray-600">
                          Método: {order.payment_method === 'pix' ? 'PIX' : 
                                  order.payment_method === 'credit' ? 'Cartão de Crédito' : 
                                  order.payment_method === 'boleto' ? 'Boleto' : order.payment_method}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {order.payments?.[0]?.status === 'pending' ? 'Pendente' :
                                  order.payments?.[0]?.status === 'completed' ? 'Concluído' :
                                  order.payments?.[0]?.status === 'failed' ? 'Falhou' : 
                                  order.payments?.[0]?.status || 'Não disponível'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Itens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items && order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ {order.subtotal?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete</span>
                      <span>R$ {order.shipping_fee?.toFixed(2) || "0.00"}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto</span>
                        <span>- R$ {order.discount?.toFixed(2) || "0.00"}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>R$ {order.total_amount?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                  
                  {order.status === 'pending' && (
                    <Button className="w-full mt-6 bg-primary">
                      Finalizar Pagamento
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => navigate('/products')}
                  >
                    Continuar Comprando
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default OrderDetails;
