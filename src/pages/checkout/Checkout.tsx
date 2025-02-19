
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, QrCode } from "lucide-react";
import { toast } from "sonner";
import OrderSummary from "@/components/orders/OrderSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { cartItems, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "pix">("credit");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast.error("Por favor, faça login para continuar");
          navigate("/login");
          return;
        }

        // Carregar perfil
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao carregar perfil:", profileError);
          return;
        }

        setProfile(profileData);
        if (profileData.zip_code) {
          setZipCode(profileData.zip_code);
          calculateShipping(profileData.zip_code);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 8 || cartItems.length === 0) return;

    setIsCalculatingShipping(true);
    try {
      const { data: correiosData, error: correiosError } = await supabase.functions.invoke("correios-shipping", {
        body: {
          zipCodeDestination: zip,
        },
      });

      if (correiosError) throw correiosError;

      const { data: shippingRate, error: shippingError } = await supabase
        .from('shipping_rates')
        .select('rate, delivery_days')
        .eq('state', correiosData.state)
        .single();

      if (shippingError) throw shippingError;

      setShippingFee(shippingRate.rate);
      toast.success(`Frete calculado: entrega em ${shippingRate.delivery_days} dias úteis`);
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      toast.error("Erro ao calcular frete. Por favor, tente novamente.");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCheckout = async () => {
    if (!session?.user) {
      toast.error("Por favor, faça login para continuar");
      navigate("/login");
      return;
    }

    if (!zipCode) {
      toast.error("Por favor, informe o CEP para entrega");
      return;
    }

    try {
      setLoading(true);
      console.log("Iniciando checkout...");

      let order;
      if (!orderId) {
        // Criar pedido apenas se não existir
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: session.user.id,
            items: cartItems.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            shipping_address: { zip_code: zipCode },
            subtotal: cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            shipping_fee: shippingFee,
            total_amount: cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + shippingFee,
            status: "pending",
            payment_method: paymentMethod,
          })
          .select()
          .single();

        if (orderError) throw orderError;
        order = newOrder;
      } else {
        // Usar pedido existente
        const { data: existingOrder, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderError) throw orderError;
        order = existingOrder;
      }

      console.log("Pedido criado/recuperado:", order);

      // Criar preferência de pagamento
      const { data: mpPreference, error: preferenceError } = await supabase.functions.invoke(
        "mercadopago-checkout",
        {
          body: {
            orderId: order.id,
            items: order.items.map((item: any) => ({
              id: item.product_id,
              title: "Produto", // Você pode buscar o nome do produto se necessário
              quantity: item.quantity,
              unit_price: Number(item.price),
            })),
            shipping_cost: shippingFee,
            buyer: {
              name: profile?.full_name || session.user.email,
              email: session.user.email,
            },
          },
        }
      );

      if (preferenceError) {
        console.error("Erro na preferência:", preferenceError);
        throw preferenceError;
      }

      console.log("Preferência MP criada:", mpPreference);

      // Atualizar pedido com ID da preferência
      await supabase
        .from("orders")
        .update({ mp_preference_id: mpPreference.id })
        .eq("id", order.id);

      // Criar registro de pagamento
      await supabase
        .from("payments")
        .insert({
          order_id: order.id,
          amount: order.total_amount,
          payment_method: paymentMethod,
          status: "pending",
          external_id: mpPreference.id
        });

      // Redirecionar para página de pagamento do Mercado Pago
      window.location.href = mpPreference.init_point;
      
      clear(); // Limpar carrinho após sucesso
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar pagamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length && !orderId) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <div className="flex gap-2">
                <Input
                  id="zipCode"
                  placeholder="00000-000"
                  value={zipCode}
                  onChange={(e) => {
                    const zip = e.target.value.replace(/\D/g, "");
                    setZipCode(zip);
                    if (zip.length === 8) {
                      calculateShipping(zip);
                    }
                  }}
                  maxLength={8}
                />
                <Button
                  variant="outline"
                  onClick={() => calculateShipping(zipCode)}
                  disabled={zipCode.length !== 8 || isCalculatingShipping}
                >
                  {isCalculatingShipping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Calcular"
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="credit" onValueChange={(v) => setPaymentMethod(v as "credit" | "pix")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credit">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Cartão
                </TabsTrigger>
                <TabsTrigger value="pix">
                  <QrCode className="w-4 h-4 mr-2" />
                  PIX
                </TabsTrigger>
              </TabsList>
              <TabsContent value="credit">
                <p className="text-sm text-muted-foreground">
                  Você será redirecionado para a página segura do Mercado Pago para finalizar o pagamento.
                </p>
              </TabsContent>
              <TabsContent value="pix">
                <p className="text-sm text-muted-foreground">
                  Você receberá um QR Code para pagamento após confirmar o pedido.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary
              items={cartItems}
              subtotal={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
              shippingFee={shippingFee}
              total={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + shippingFee}
            />

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleCheckout}
              disabled={loading || !zipCode}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Finalizar Compra"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
