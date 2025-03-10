
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Success = () => {
  const location = useLocation();
  const { clear } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = location.state?.orderId;
  const paymentMethod = location.state?.paymentMethod || "Cartão";

  // Copiar número do pedido
  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
        .then(() => toast.success("Número do pedido copiado!"))
        .catch(() => toast.error("Erro ao copiar"));
    }
  };

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
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{orderId || "Não disponível"}</span>
                    {orderId && (
                      <Button size="sm" variant="ghost" onClick={copyOrderId} className="h-6 w-6 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Forma de Pagamento:</span>
                  <span className="font-medium capitalize">
                    {paymentMethod === 'pix' ? 'PIX' : 
                     paymentMethod === 'credit' ? 'Cartão de Crédito' : 
                     paymentMethod === 'boleto' ? 'Boleto Bancário' : 
                     paymentMethod}
                  </span>
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
                      <span className={`font-medium px-2 py-1 rounded ${
                        orderDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        orderDetails.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {orderDetails.status === 'pending' ? 'Aguardando pagamento' : 
                         orderDetails.status === 'paid' ? 'Pago' : 
                         orderDetails.status}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {paymentMethod === 'pix' && orderDetails?.payments?.[0]?.pix_code && (
              <div className="mb-6 p-4 border rounded-lg bg-green-50">
                <h3 className="font-semibold text-green-800 mb-2">Pagamento via PIX</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Caso ainda não tenha realizado o pagamento, utilize o código PIX abaixo:
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="text" 
                    value={orderDetails.payments[0].pix_code || ""}
                    readOnly
                    className="w-full bg-white border rounded px-3 py-2 text-xs font-mono"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      navigator.clipboard.writeText(orderDetails.payments[0].pix_code);
                      toast.success("Código PIX copiado!");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-red-600 font-medium">
                  Você tem até 5 minutos para realizar o pagamento via PIX.
                </p>
              </div>
            )}
            
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
