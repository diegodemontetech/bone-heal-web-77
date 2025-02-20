import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import OrderTotal from "@/components/checkout/OrderTotal";

interface ShippingRate {
  rate: number;
  delivery_days: number;
  service_type: string;
  name: string;
}

const Checkout = () => {
  const { cartItems, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [zipCode, setZipCode] = useState<string>("");
  const [availableShippingRates, setAvailableShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");

  // Carregar perfil do usuário e calcular frete
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

  const calculateDeliveryDate = (shippingDays: number) => {
    const date = new Date();
    date.setDate(date.getDate() + shippingDays);
    setDeliveryDate(date);
  };

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 8) {
      return;
    }

    setIsCalculatingShipping(true);
    
    try {
      const { data: shippingRates, error } = await supabase
        .from('shipping_rates')
        .select('rate, delivery_days, service_type')
        .in('service_type', ['PAC', 'SEDEX'])
        .eq('state', 'SP');

      if (error) throw error;

      if (shippingRates?.length) {
        // Inicialmente seleciona o PAC como padrão
        const pacRate = shippingRates.find(rate => rate.service_type === 'PAC');
        if (pacRate) {
          setShippingFee(pacRate.rate);
          calculateDeliveryDate(pacRate.delivery_days);
          setSelectedShippingRate(pacRate);
        }
        
        setAvailableShippingRates(shippingRates.map(rate => ({
          ...rate,
          name: rate.service_type === 'PAC' ? 'Convencional' : 'Express'
        })));
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const applyVoucherDiscount = (voucher: any, currentShippingFee: number) => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let discountValue = 0;

    if (voucher.discount_type === 'percentage') {
      if (voucher.discount_value === 100) {
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
    if (!voucherCode) return;

    setVoucherLoading(true);
    try {
      const { data: voucher, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', voucherCode.toUpperCase())
        .single();

      if (error || !voucher) {
        setVoucherCode("");
        return;
      }

      const now = new Date();
      if (voucher.valid_until && new Date(voucher.valid_until) < now) {
        setVoucherCode("");
        return;
      }

      if (voucher.max_uses && voucher.current_uses >= voucher.max_uses) {
        setVoucherCode("");
        return;
      }

      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      if (voucher.min_amount && subtotal < voucher.min_amount) {
        setVoucherCode("");
        return;
      }

      applyVoucherDiscount(voucher, shippingFee);
      setAppliedVoucher(voucher);
    } catch (error) {
      console.error("Erro ao aplicar cupom:", error);
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

  const listenToPaymentStatus = async (orderId: string) => {
    const channel = supabase
      .channel('payment-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const status = payload.new.status;
          if (status === 'paid') {
            navigate(`/orders`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const openCheckoutPopup = (url: string, orderId: string) => {
    const width = Math.min(900, window.innerWidth - 20);
    const height = Math.min(600, window.innerHeight - 20);
    const left = Math.max(0, (window.innerWidth - width) / 2);
    const top = Math.max(0, (window.innerHeight - height) / 2);

    const popup = window.open(
      url,
      'MercadoPago',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = url;
      return;
    }

    listenToPaymentStatus(orderId);

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        setLoading(false);
      }
    }, 1000);
  };

  const handleCheckout = async () => {
    if (!cartItems.length) {
      navigate("/products");
      return;
    }

    if (!session?.user) {
      navigate("/login");
      return;
    }

    if (!zipCode) return;

    try {
      setLoading(true);

      const orderId = crypto.randomUUID();
      
      const subtotal = cartItems.reduce((acc, item) => 
        acc + (Number(item.price) * item.quantity), 0
      );
      const shippingCost = Number(shippingFee) || 0;
      const discountValue = Number(discount) || 0;
      const total = Math.max(0, Number((subtotal + shippingCost - discountValue).toFixed(2)));

      if (total <= 0) return;

      await saveOrder(orderId);

      // Redireciona para a página do pedido
      navigate(`/orders/${orderId}`, {
        state: { 
          showPaymentButton: true,
          paymentMethod,
          orderTotal: total
        }
      });
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      setLoading(false);
    }
  };

  const handleShippingRateChange = (rate: ShippingRate) => {
    setShippingFee(rate.rate);
    calculateDeliveryDate(rate.delivery_days);
    setSelectedShippingRate(rate);
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
            shippingRates={availableShippingRates}
            selectedShippingRate={selectedShippingRate}
            onShippingRateChange={handleShippingRateChange}
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
          deliveryDate={deliveryDate}
        />
      </div>
    </div>
  );
};

export default Checkout;
