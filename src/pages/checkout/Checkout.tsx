
import { useShipping } from "@/hooks/shipping";
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
import EmptyCartMessage from "@/components/checkout/EmptyCartMessage";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const location = useLocation();
  const shippingFromCart = location.state?.shipping || null;
  
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
    setZipCode,
    calculateShipping
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
    orderId
  } = useCheckout();

  // Verificar autenticação diretamente uma vez
  useEffect(() => {
    const checkAuth = async () => {
      if (!session?.user) {
        const { data, error } = await supabase.auth.getSession();
        console.log("[Checkout] Verificação direta adicional:", data?.session?.user);
        
        if (error) {
          console.error("Erro ao verificar autenticação:", error);
        }
      }
    };
    
    checkAuth();
  }, [session]);

  // Usar informações de frete que vieram do carrinho, se disponíveis
  useEffect(() => {
    if (shippingFromCart?.zipCode && zipCode.length === 0) {
      console.log("Usando informações de frete do carrinho:", shippingFromCart);
      
      // Definir o CEP do carrinho
      setZipCode(shippingFromCart.zipCode);
      
      // Forçar um cálculo de frete se não tivermos ainda
      if (shippingRates.length === 0) {
        setTimeout(() => {
          calculateShipping(shippingFromCart.zipCode);
        }, 500);
      }
    }
  }, [shippingFromCart, zipCode, shippingRates.length, setZipCode, calculateShipping]);

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    if (isInitialized && isAuthChecked && !hasValidSession) {
      console.error("Usuário não autenticado na página de checkout");
      toast.error("É necessário estar logado para finalizar a compra.");
    }
  }, [isInitialized, isAuthChecked, hasValidSession]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleVoucherApply = () => {
    applyVoucher(subtotal, shippingFee);
  };

  const handleCheckout = async () => {
    // Log para depuração
    console.log("Checkout iniciado. Estado de autenticação:", {
      session: !!session, 
      hasValidSession,
      selectedShippingRate: !!selectedShippingRate
    });
    
    if (!selectedShippingRate) {
      toast.error("Selecione uma opção de frete para continuar");
      return;
    }
    
    // Verificar autenticação diretamente para garantir
    const { data: currentSession } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.user || !!currentSession?.session?.user;
    
    if (!isAuthenticated) {
      console.error("Usuário não autenticado ao tentar finalizar compra");
      toast.error("É necessário estar logado para finalizar a compra.");
      return;
    }
    
    console.log("Iniciando checkout com método:", paymentMethod);
    processCheckout(cartItems, selectedShippingRate.zipCode, shippingFee, discount, appliedVoucher);
  };

  // Mostra um loading simples enquanto inicializa
  if (!isInitialized || !isAuthChecked) {
    return <CheckoutLoading />;
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
            isLoggedIn={!!session?.user || hasValidSession}
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
