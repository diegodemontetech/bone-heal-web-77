
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { cartItems, total, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "pix">("credit");

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
      if (data.zip_code) {
        setZipCode(data.zip_code);
        calculateShipping(data.zip_code);
      }
    };

    getProfile();
  }, [session, navigate]);

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 8 || cartItems.length === 0) return;

    setIsCalculatingShipping(true);
    try {
      const { data: shipping, error } = await supabase.functions.invoke(
        "omie-integration",
        {
          body: {
            action: "calculate_shipping",
            zip_code: zip,
            items: cartItems.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price
            })),
          },
        }
      );

      if (error) throw error;
      setShippingFee(shipping?.value || 0);
    } catch (error) {
      console.error("Error calculating shipping:", error);
      toast.error("Erro ao calcular frete");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      if (!zipCode) {
        toast.error("Por favor, informe o CEP para entrega");
        return;
      }

      // Criar pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session?.user?.id,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shipping_address: { zip_code: zipCode },
          subtotal: total,
          shipping_fee: shippingFee,
          total_amount: total + shippingFee,
          status: "pending",
          payment_method: paymentMethod,
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
            items: cartItems.map((item) => ({
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
          amount: total + shippingFee,
          payment_method: paymentMethod,
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

  if (!cartItems.length) {
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
              subtotal={total}
              shippingFee={shippingFee}
              total={total + shippingFee}
            />

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleCheckout}
              disabled={loading || !zipCode}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Processando..." : "Finalizar Compra"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
