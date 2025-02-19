
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import OrderTotal from "@/components/checkout/OrderTotal";

const Checkout = () => {
  const { cartItems, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
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
        .eq('state', 'SP')
        .single();

      if (error) throw error;

      if (shippingRate) {
        setShippingFee(shippingRate.rate);
        
        if (appliedVoucher) {
          applyVoucherDiscount(appliedVoucher, shippingRate.rate);
        }
        
        toast.success("Frete calculado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      toast.error("Erro ao calcular o frete. Por favor, tente novamente.");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const applyVoucherDiscount = (voucher: any, currentShippingFee: number) => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let discountValue = 0;

    if (voucher.discount_type === 'percentage') {
      if (voucher.discount_value === 100) {
        // Se for 100%, aplica o desconto total no frete
        discountValue = currentShippingFee;
      } else {
        discountValue = (subtotal * voucher.discount_value) / 100;
      }
    } else if (voucher.discount_type === 'fixed') {
      discountValue = voucher.discount_value;
    }

    setDiscount(discountValue);
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

      applyVoucherDiscount(voucher, shippingFee);
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
      const total_amount = Math.max(0, subtotal + shippingFee - discount);

      const { error: orderError } = await supabase
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
          payment_method: 'mercadopago'
        });

      if (orderError) throw orderError;

      // Criar registro de pagamento
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          status: 'pending',
          amount: total_amount,
          payment_method: 'mercadopago'
        });

      if (paymentError) throw paymentError;

      if (appliedVoucher) {
        await supabase
          .from('vouchers')
          .update({ current_uses: (appliedVoucher.current_uses || 0) + 1 })
          .eq('id', appliedVoucher.id);
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
      
      const subtotal = cartItems.reduce((acc, item) => 
        acc + (Number(item.price) * item.quantity), 0
      );
      const shippingCost = Number(shippingFee) || 0;
      const discountValue = Number(discount) || 0;
      const total = Math.max(0, Number((subtotal + shippingCost - discountValue).toFixed(2)));

      console.log("Valores calculados:", {
        subtotal,
        shippingCost,
        discountValue,
        total,
        items: cartItems
      });

      if (total <= 0) {
        toast.error("O valor total do pedido deve ser maior que zero");
        return;
      }

      await saveOrder(orderId);

      const { data, error } = await supabase.functions.invoke(
        "mercadopago-checkout",
        {
          body: {
            orderId,
            items: cartItems.map(item => ({
              title: item.name,
              price: Number(Number(item.price).toFixed(2)),
              quantity: Number(item.quantity)
            })),
            shipping_cost: shippingCost,
            discount: discountValue,
            buyer: {
              name: session.user.email?.split('@')[0] || 'Cliente',
              email: session.user.email,
            },
            total_amount: total
          },
        }
      );

      if (error) {
        console.error("Erro na função do Mercado Pago:", error);
        throw error;
      }

      if (!data?.init_point) {
        throw new Error("URL de checkout não gerada");
      }

      clear();
      window.location.href = data.init_point;
      
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
