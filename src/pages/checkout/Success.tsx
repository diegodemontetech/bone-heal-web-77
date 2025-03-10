
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clear } = useCart();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const externalReference = searchParams.get("external_reference");
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status") || "approved";

  useEffect(() => {
    // Limpar o carrinho quando o pagamento é confirmado
    clear();
    
    // Buscar detalhes do pedido
    const fetchOrderDetails = async () => {
      if (!externalReference) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, payments(*)")
          .eq("id", externalReference)
          .single();

        if (error) throw error;
        
        setOrderData(data);

        // Atualizar o status do pagamento se necessário
        if (paymentId && status === "approved") {
          await supabase
            .from("payments")
            .update({ status: "completed", payment_id: paymentId })
            .eq("order_id", externalReference);
            
          // Atualizar também o status do pedido
          await supabase
            .from("orders")
            .update({ status: "completed" })
            .eq("id", externalReference);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [externalReference, paymentId, status, clear]);

  // Redirecionar para a home se não houver referência de pedido
  useEffect(() => {
    if (!loading && !externalReference) {
      navigate("/");
    }
  }, [loading, externalReference, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Pagamento Confirmado!</h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Agradecemos por sua compra. Seu pedido foi recebido e está sendo processado.
          </p>
          
          {orderData && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h2 className="font-semibold text-gray-900 mb-2">Resumo do Pedido</h2>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Número do Pedido:</span>
                <span className="text-sm font-medium">{orderData.id.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-sm font-medium">
                  R$ {orderData.total_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-medium text-green-600">Aprovado</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to="/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver Meus Pedidos
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/products">
                <ArrowRight className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
