
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import OrderTotal from "@/components/checkout/OrderTotal";
import { useShipping } from "@/hooks/use-shipping";
import { useVoucher } from "@/hooks/use-voucher";
import { useCheckout } from "@/hooks/use-checkout";

const Checkout = () => {
  const { cartItems, clear } = useCart();
  const session = useSession();
  const navigate = useNavigate();
  
  const {
    shippingRates,
    selectedShippingRate,
    loading: shippingLoading,
    shippingFee,
    deliveryDate,
    handleShippingRateChange
  } = useShipping();

  const {
    voucherCode,
    setVoucherCode,
    voucherLoading,
    appliedVoucher,
    discount,
    applyVoucher,
    removeVoucher
  } = useVoucher();

  const {
    loading,
    paymentMethod,
    setPaymentMethod,
    handleCheckout: processCheckout
  } = useCheckout();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleVoucherApply = () => {
    applyVoucher(subtotal, shippingFee);
  };

  const handleCheckout = () => {
    if (selectedShippingRate) {
      processCheckout(cartItems, selectedShippingRate.zipCode, shippingFee, discount, appliedVoucher);
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
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            voucherLoading={voucherLoading}
            appliedVoucher={appliedVoucher}
            applyVoucher={handleVoucherApply}
            removeVoucher={removeVoucher}
            shippingRates={shippingRates}
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
          hasZipCode={!!selectedShippingRate}
          onCheckout={handleCheckout}
          deliveryDate={deliveryDate}
        />
      </div>
    </div>
  );
};

export default Checkout;
