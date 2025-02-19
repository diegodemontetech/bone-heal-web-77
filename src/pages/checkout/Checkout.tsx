
import { useState } from "react";
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
  const { cartItems, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "pix">("credit");

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
      console.log("Iniciando checkout simplificado...");

      // Teste simples da função edge
      const { data, error } = await supabase.functions.invoke(
        "mercadopago-checkout",
        {
          body: {
            orderId: "test-123",
            items: cartItems.map(item => ({
              id: item.id,
              title: item.name,
              quantity: item.quantity,
              unit_price: item.price,
            })),
            shipping_cost: shippingFee,
            buyer: {
              name: session.user.email,
              email: session.user.email,
            },
          },
        }
      );

      if (error) {
        console.error("Erro no teste:", error);
        throw error;
      }

      console.log("Resposta do teste:", data);
      toast.success("Teste da função edge realizado com sucesso!");
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar pagamento. Por favor, tente novamente.");
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
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={8}
                />
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
                  Você será redirecionado para a página segura do Mercado Pago.
                </p>
              </TabsContent>
              <TabsContent value="pix">
                <p className="text-sm text-muted-foreground">
                  Você receberá um QR Code para pagamento.
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
