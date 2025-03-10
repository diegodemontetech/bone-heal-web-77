
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";

const Success = () => {
  const location = useLocation();
  const { clear } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = location.state?.orderId;
  const paymentMethod = location.state?.paymentMethod || "Cartão";

  useEffect(() => {
    // Limpar carrinho ao chegar na página de sucesso
    clear();
    
    // Buscar detalhes do pedido
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, payments(*)')
          .eq('id', orderId)
          .single();
          
        if (error) throw error;
        
        setOrderDetails(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, clear]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center text-primary mb-2">
              Pedido Realizado com Sucesso!
            </h1>
            
            <p className="text-center text-gray-600 mb-8">
              Seu pedido foi registrado e está sendo processado.
            </p>
            
            <div className="border-t border-b py-6 my-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <span className="font-medium">{orderId || "Não disponível"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Forma de Pagamento:</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
                </div>
                
                {orderDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">
                        R$ {orderDetails.total_amount.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {orderDetails.status === 'pending' ? 'Aguardando pagamento' : orderDetails.status}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/profile">
                <Button variant="outline" className="w-full">
                  Ver Meus Pedidos
                </Button>
              </Link>
              
              <Link to="/products">
                <Button className="w-full bg-primary">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Success;
