
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, QrCode, Wallet } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const showPaymentButton = location.state?.showPaymentButton;
  const paymentMethod = location.state?.paymentMethod;
  const orderTotal = location.state?.orderTotal;

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone,
            zip_code
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Erro ao carregar pedido:", error);
        return;
      }

      setOrder(data);
    };

    loadOrder();
  }, [id]);

  const handlePayment = async () => {
    if (!order) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "mercadopago-checkout",
        {
          body: {
            orderId: order.id,
            items: order.items.map((item: any) => ({
              title: item.name,
              price: Number(Number(item.price).toFixed(2)),
              quantity: Number(item.quantity)
            })),
            shipping_cost: order.shipping_fee,
            discount: order.discount,
            buyer: {
              name: session?.user?.email?.split('@')[0] || 'Cliente',
              email: session?.user?.email,
            },
            total_amount: orderTotal || order.total_amount,
            payment_method: paymentMethod
          },
        }
      );

      if (error) throw error;

      if (!data?.init_point) {
        throw new Error("URL de checkout não gerada");
      }

      const width = Math.min(900, window.innerWidth - 20);
      const height = Math.min(600, window.innerHeight - 20);
      const left = Math.max(0, (window.innerWidth - width) / 2);
      const top = Math.max(0, (window.innerHeight - height) / 2);

      window.open(
        data.init_point,
        'MercadoPago',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
      );
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Pedido #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600">
              Realizado em {format(new Date(order.created_at), "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Status do pedido</p>
            <p className="text-lg font-bold text-primary">
              {order.status === 'pending' ? 'Pendente' : 
               order.status === 'paid' ? 'Pago' : 
               order.status === 'shipped' ? 'Enviado' : 
               'Processando'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-medium mb-3">Itens do Pedido</h2>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.quantity}x {item.name}</p>
                  </div>
                  <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-medium mb-3">Resumo</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>R$ {order.shipping_fee.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- R$ {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>R$ {order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {showPaymentButton && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  {paymentMethod === 'credit' && <CreditCard className="w-5 h-5" />}
                  {paymentMethod === 'pix' && <QrCode className="w-5 h-5" />}
                  {paymentMethod === 'boleto' && <Wallet className="w-5 h-5" />}
                  <span className="font-medium">
                    {paymentMethod === 'credit' ? 'Cartão de Crédito' :
                     paymentMethod === 'pix' ? 'PIX' : 'Boleto Bancário'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/orders')}
                >
                  Ver Meus Pedidos
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  Realizar Pagamento
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
