
import { useShipping } from "@/hooks/use-shipping";
import { useVoucher } from "@/hooks/use-voucher";
import { useCheckout } from "@/hooks/use-checkout";
import { useCheckoutPage } from "@/hooks/use-checkout-page";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import OrderTotal from "@/components/checkout/OrderTotal";
import CheckoutLoading from "@/components/checkout/CheckoutLoading";
import PaymentRedirect from "@/components/checkout/PaymentRedirect";
import EmptyCartMessage from "@/components/checkout/EmptyCartMessage";

const Checkout = () => {
  const {
    isInitialized,
    isAuthChecked,
    hasValidSession,
    cartItems,
    session,
    clear
  } = useCheckoutPage();
  
  const {
    shippingRates,
    selectedShippingRate,
    loading: shippingLoading,
    shippingFee,
    deliveryDate,
    handleShippingRateChange,
    zipCode,
    setZipCode
  } = useShipping(cartItems);

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
    handleCheckout: processCheckout,
    paymentUrl,
    orderId
  } = useCheckout();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleVoucherApply = () => {
    applyVoucher(subtotal, shippingFee);
  };

  const handleCheckout = () => {
    if (!selectedShippingRate) {
      toast.error("Selecione uma opção de frete para continuar");
      return;
    }
    
    if (!session?.user) {
      toast.error("Você precisa estar logado para finalizar a compra");
      return;
    }
    
    processCheckout(cartItems, selectedShippingRate.zipCode, shippingFee, discount, appliedVoucher);
  };

  // Mostra um loading simples enquanto inicializa
  if (!isInitialized || !isAuthChecked) {
    return <CheckoutLoading />;
  }

  // Se temos URL de pagamento, realizar redirect
  if (paymentUrl && orderId) {
    clear(); // Limpar o carrinho após o checkout
    return <PaymentRedirect paymentUrl={paymentUrl} />;
  }

  // Se o carrinho estiver vazio, mostrar mensagem e link para produtos
  if (!cartItems.length) {
    return <EmptyCartMessage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 py-8 flex-1">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Finalizar Compra</h1>
        </div>
        <Separator className="mb-8" />
        
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
              shippingLoading={shippingLoading}
              zipCode={zipCode}
              setZipCode={setZipCode}
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
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Checkout;
