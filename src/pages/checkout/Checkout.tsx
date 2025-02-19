import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, QrCode, Tag } from "lucide-react";
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
  const [pixQrCode, setPixQrCode] = useState<string>("");
  const [pixCode, setPixCode] = useState<string>("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [discount, setDiscount] = useState(0);

  // Carregar CEP do perfil quando logado
  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('zip_code')
          .eq('id', session.user.id)
          .single();

        if (profile?.zip_code) {
          setZipCode(profile.zip_code);
          calculateShipping(profile.zip_code);
        }
      }
    };

    loadUserProfile();
  }, [session]);

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 8) {
      toast.error("Por favor, insira um CEP válido");
      return;
    }

    setIsCalculatingShipping(true);
    
    try {
      const { data: shippingRate, error } = await supabase
        .from('shipping_rates')
        .select('rate')
        .eq('state', 'SP') // Temporariamente fixo em SP
        .single();

      if (error) throw error;

      if (shippingRate) {
        setShippingFee(shippingRate.rate);
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      toast.error("Erro ao calcular o frete. Por favor, tente novamente.");
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
            payment_method: paymentMethod,
          },
        }
      );

      if (error) throw error;

      console.log("Resposta:", data);

      if (paymentMethod === "pix") {
        setPixQrCode(data.qr_code_base64);
        setPixCode(data.qr_code);
        toast.success("QR Code PIX gerado com sucesso!");
      } else {
        // Redirecionamento para checkout do cartão
        window.location.href = data.init_point;
      }
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar pagamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const applyVoucher = async () => {
    if (!voucherCode) {
      toast.error("Digite um cupom válido");
      return;
    }

    setVoucherLoading(true);
    try {
      const { data: voucher, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', voucherCode.toUpperCase())
        .single();

      if (error) throw error;

      if (!voucher) {
        toast.error("Cupom não encontrado");
        return;
      }

      const now = new Date();
      if (voucher.valid_until && new Date(voucher.valid_until) < now) {
        toast.error("Cupom expirado");
        return;
      }

      if (voucher.max_uses && voucher.current_uses >= voucher.max_uses) {
        toast.error("Cupom esgotado");
        return;
      }

      // Validar regras específicas
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      if (voucher.min_amount && subtotal < voucher.min_amount) {
        toast.error(`Valor mínimo para este cupom: R$ ${voucher.min_amount}`);
        return;
      }

      // Calcular desconto
      let discountValue = 0;
      if (voucher.discount_type === 'percentage') {
        discountValue = (subtotal * voucher.discount_value) / 100;
      } else if (voucher.discount_type === 'fixed') {
        discountValue = voucher.discount_value;
      } else if (voucher.discount_type === 'shipping') {
        discountValue = shippingFee;
      }

      setDiscount(discountValue);
      setAppliedVoucher(voucher);
      toast.success("Cupom aplicado com sucesso!");
    } catch (error) {
      console.error("Erro ao aplicar cupom:", error);
      toast.error("Erro ao aplicar cupom");
    } finally {
      setVoucherLoading(false);
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
                    const newZip = e.target.value.replace(/\D/g, "");
                    setZipCode(newZip);
                    if (newZip.length === 8) {
                      calculateShipping(newZip);
                    }
                  }}
                  maxLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voucher">Cupom de Desconto</Label>
              <div className="flex gap-2">
                <Input
                  id="voucher"
                  placeholder="Digite seu cupom"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  disabled={!!appliedVoucher}
                />
                <Button 
                  variant="outline" 
                  onClick={applyVoucher}
                  disabled={voucherLoading || !!appliedVoucher}
                >
                  {voucherLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Tag className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {appliedVoucher && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Cupom aplicado: {appliedVoucher.code}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherCode("");
                      setDiscount(0);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              )}
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
                {pixQrCode ? (
                  <div className="space-y-4">
                    <img 
                      src={`data:image/png;base64,${pixQrCode}`}
                      alt="QR Code PIX"
                      className="mx-auto"
                    />
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Código PIX:</p>
                      <p className="text-xs break-all">{pixCode}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    O QR Code será gerado após clicar em "Finalizar Compra".
                  </p>
                )}
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
              discount={discount}
              total={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + shippingFee - discount}
            />

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleCheckout}
              disabled={loading || !zipCode || !session}
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

            {!session && (
              <p className="text-sm text-red-500 text-center mt-2">
                Faça login para finalizar a compra
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
