
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import OrderTotal from "@/components/checkout/OrderTotal";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

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

      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      if (voucher.min_amount && subtotal < voucher.min_amount) {
        toast.error(`Valor mínimo para este cupom: R$ ${voucher.min_amount}`);
        return;
      }

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

  const saveOrder = async (orderId: string) => {
    try {
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const total_amount = subtotal + shippingFee - discount;

      const { error } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: session?.user?.id,
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          })),
          shipping_fee: shippingFee,
          discount: discount,
          subtotal: subtotal,
          total_amount: total_amount,
          status: 'pending',
          shipping_address: {
            zip_code: zipCode
          },
          payment_method: paymentMethod
        });

      if (error) {
        console.error("Erro detalhado ao salvar pedido:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      throw error;
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

      const orderId = crypto.randomUUID();
      const subtotal = Number(cartItems.reduce((acc, item) => 
        acc + (Number(item.price) * item.quantity), 0
      ).toFixed(2));

      const shippingCost = Number(shippingFee.toFixed(2));
      const discountValue = Number(discount.toFixed(2));
      const total = Number((subtotal + shippingCost - discountValue).toFixed(2));

      console.log("Dados do checkout:", {
        orderId,
        cartItems,
        subtotal,
        shippingCost,
        discountValue,
        total
      });

      // Primeiro salva o pedido
      await saveOrder(orderId);

      // Depois processa o pagamento
      const { data, error } = await supabase.functions.invoke(
        "mercadopago-checkout",
        {
          body: {
            orderId,
            items: cartItems.map(item => ({
              id: item.id,
              title: item.name,
              quantity: item.quantity,
              price: Number(Number(item.price).toFixed(2)),
            })),
            shipping_cost: shippingCost,
            buyer: {
              name: session.user.email,
              email: session.user.email,
            },
            payment_method: paymentMethod,
            total_amount: total
          },
        }
      );

      if (error) {
        console.error("Erro na resposta do checkout:", error);
        throw error;
      }

      console.log("Resposta do checkout:", data);

      if (paymentMethod === "pix") {
        if (!data.qr_code || !data.qr_code_base64) {
          throw new Error("QR Code não gerado corretamente");
        }
        setPixQrCode(data.qr_code_base64);
        setPixCode(data.qr_code);
        toast.success("QR Code PIX gerado com sucesso!");
      } else {
        // Integração transparente de cartão
        const script = document.createElement('script');
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.type = "text/javascript";
        script.onload = () => {
          const mp = new window.MercadoPago(data.public_key, {
            locale: 'pt-BR'
          });

          const cardForm = mp.cardForm({
            amount: data.amount.toString(),
            iframe: true,
            form: {
              id: "form-checkout",
              cardNumber: {
                id: "form-checkout__cardNumber",
                placeholder: "Número do cartão",
              },
              expirationDate: {
                id: "form-checkout__expirationDate",
                placeholder: "MM/YY",
              },
              securityCode: {
                id: "form-checkout__securityCode",
                placeholder: "CVV",
              },
              cardholderName: {
                id: "form-checkout__cardholderName",
                placeholder: "Titular do cartão",
              },
              issuer: {
                id: "form-checkout__issuer",
                placeholder: "Banco emissor",
              },
              installments: {
                id: "form-checkout__installments",
                placeholder: "Parcelas",
              },
            },
            callbacks: {
              onFormMounted: error => {
                if (error) {
                  console.error("Form mounted handling error:", error);
                  toast.error("Erro ao carregar formulário de pagamento");
                }
              },
              onSubmit: event => {
                event.preventDefault();
                const formData = cardForm.getCardFormData();
                console.log("Dados do cartão:", formData);
                // Processamento do pagamento...
              },
              onError: error => {
                console.error("Card form error:", error);
                toast.error("Erro no processamento do cartão");
              }
            },
          });
        };
        document.body.appendChild(script);
      }
      
      // Limpa o carrinho após sucesso
      if (data.payment_id) {
        clear();
      }
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
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
          <Button onClick={() => navigate("/products")}>
            Continuar comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DeliveryInformation
            zipCode={zipCode}
            setZipCode={setZipCode}
            calculateShipping={calculateShipping}
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            voucherLoading={voucherLoading}
            appliedVoucher={appliedVoucher}
            applyVoucher={applyVoucher}
            removeVoucher={() => {
              setAppliedVoucher(null);
              setVoucherCode("");
              setDiscount(0);
            }}
          />

          <PaymentMethods
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            loading={loading}
            pixQrCode={pixQrCode}
            pixCode={pixCode}
          />
        </div>

        <OrderTotal
          cartItems={cartItems}
          shippingFee={shippingFee}
          discount={discount}
          loading={loading}
          isLoggedIn={!!session}
          hasZipCode={!!zipCode}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Checkout;
