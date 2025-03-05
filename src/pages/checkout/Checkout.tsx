
import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeliveryInformation from "@/components/checkout/DeliveryInformation";
import OrderTotal from "@/components/checkout/OrderTotal";
import { useShipping } from "@/hooks/use-shipping";
import { useVoucher } from "@/hooks/use-voucher";
import { useCheckout } from "@/hooks/use-checkout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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
    handleShippingRateChange,
    zipCode
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
    handleCheckout: processCheckout,
    paymentUrl,
    orderId
  } = useCheckout();

  // Redirecionar para o carrinho se não houver itens
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleVoucherApply = () => {
    applyVoucher(subtotal, shippingFee);
  };

  const handleCheckout = () => {
    if (selectedShippingRate && session?.user) {
      processCheckout(cartItems, selectedShippingRate.zipCode, shippingFee, discount, appliedVoucher);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4 flex-1">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
            <Button 
              onClick={() => navigate("/products")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Continuar comprando
            </Button>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  // Se temos URL de pagamento, realizar redirect
  if (paymentUrl && orderId) {
    clear(); // Limpar o carrinho após o checkout
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4 py-12 flex-1">
          <div className="max-w-2xl mx-auto">
            <Alert className="mb-8 border-green-200 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle>Pedido realizado com sucesso!</AlertTitle>
              <AlertDescription className="mt-2">
                Seu pedido foi registrado. Agora você será redirecionado para concluir o pagamento.
              </AlertDescription>
            </Alert>
            
            <div className="text-center space-y-6 p-6 border rounded-lg bg-white">
              <p className="text-lg">Você será redirecionado para a página de pagamento em instantes...</p>
              <Button 
                onClick={() => window.location.href = paymentUrl}
                className="bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                Ir para pagamento agora
              </Button>
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
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
