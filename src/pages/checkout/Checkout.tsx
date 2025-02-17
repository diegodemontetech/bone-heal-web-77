
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { items, total, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!session?.user) {
      navigate("/login");
      return;
    }

    const getProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast.error("Erro ao carregar perfil");
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [session, navigate]);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Criar pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session?.user?.id,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Criar preferência de pagamento no Mercado Pago
      const { data: preference, error: preferenceError } = await supabase.functions.invoke(
        "mercadopago-checkout",
        {
          body: {
            orderId: order.id,
            items: items.map((item) => ({
              id: item.id,
              title: item.name,
              quantity: item.quantity || 1,
              unit_price: Number(item.price),
            })),
            buyer: {
              name: profile?.full_name || session?.user?.email,
              email: session?.user?.email,
            },
          },
        }
      );

      if (preferenceError) throw preferenceError;

      // Criar registro de pagamento
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: order.id,
          amount: total,
          mercadopago_preference_id: preference.id,
        });

      if (paymentError) throw paymentError;

      // Limpar carrinho e redirecionar para o Mercado Pago
      clear();
      window.location.href = preference.init_point;
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Seu carrinho está vazio</p>
            <Button
              className="mt-4 mx-auto block"
              onClick={() => navigate("/products")}
            >
              Continuar comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Itens do pedido</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantidade: {item.quantity || 1}
                    </p>
                  </div>
                  <p className="font-medium">
                    R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {loading ? "Processando..." : "Finalizar Compra"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
