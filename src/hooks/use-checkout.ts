
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/hooks/use-cart";

export function useCheckout() {
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");

  const saveOrder = async (
    orderId: string, 
    cartItems: CartItem[], 
    shippingFee: number, 
    discount: number, 
    zipCode: string, 
    appliedVoucher: any
  ) => {
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

  const handleCheckout = async (
    cartItems: CartItem[],
    zipCode: string,
    shippingFee: number,
    discount: number,
    appliedVoucher: any
  ) => {
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

      await saveOrder(orderId, cartItems, shippingFee, discount, zipCode, appliedVoucher);

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

  return {
    loading,
    paymentMethod,
    setPaymentMethod,
    handleCheckout
  };
}
