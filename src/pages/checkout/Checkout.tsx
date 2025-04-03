
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { supabase } from "@/integrations/supabase/client";
import { useCheckoutPage } from '@/hooks/use-checkout-page';
import { useCheckout } from '@/hooks/use-checkout';
import DeliveryInformation from '@/components/checkout/DeliveryInformation';
import OrderTotal from '@/components/checkout/OrderTotal';
import { useShipping } from '@/hooks/use-shipping';
import { ShippingCalculationRate } from "@/types/shipping";
import { useDeliveryDate } from '@/hooks/shipping/use-delivery-date';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { isInitialized, hasValidSession, cartItems, session } = useCheckoutPage();
  const { calculateDeliveryDate } = useDeliveryDate();
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Shipping and payment states
  const { paymentMethod, setPaymentMethod, checkoutData, loading, handleCheckout, orderId } = useCheckout();
  const { 
    shippingRates, 
    selectedShippingRate, 
    setZipCode, 
    calculateShipping, 
    shippingFee, 
    deliveryDate, 
    handleShippingRateChange 
  } = useShipping(cartItems);

  // Fetch user profile and address information and automatically calculate shipping
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoadingProfile(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        setUserProfile(data);
        
        // Automatically set ZIP code and calculate shipping if profile has zip_code
        if (data?.zip_code) {
          const cleanZipCode = data.zip_code.replace(/\D/g, '');
          console.log("Usando CEP do perfil do usuário:", cleanZipCode);
          setZipCode(cleanZipCode);
          
          // Automatic shipping calculation
          try {
            await calculateShipping(cleanZipCode);
            console.log("Frete calculado automaticamente com o CEP do usuário:", cleanZipCode);
          } catch (calcError) {
            console.error("Erro ao calcular frete automaticamente:", calcError);
            toast.error("Não foi possível calcular o frete automaticamente. Por favor, verifique seu CEP.");
          }
        } else {
          console.log("Usuário não tem CEP cadastrado no perfil");
          toast.error("Por favor, atualize seu perfil com o CEP para cálculo automático de frete");
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadUserProfile();
  }, [session?.user?.id, setZipCode, calculateShipping]);

  // Process checkout
  const handleProcessPayment = () => {
    if (!hasValidSession) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (!selectedShippingRate || !selectedShippingRate.zipCode) {
      toast.error("É necessário calcular o frete antes de finalizar a compra");
      return;
    }
    
    handleCheckout(
      cartItems,
      selectedShippingRate.zipCode,
      shippingFee,
      discount,
      appliedVoucher
    );
  };

  // Show loading state while determining cart status
  if (!isInitialized || isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando checkout...</p>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  // If cart has items, display the checkout page
  if (cartItems && cartItems.length > 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <DeliveryInformation />
              </div>
              
              <div className="lg:col-span-1">
                <OrderTotal 
                  cartItems={cartItems}
                  shippingFee={shippingFee}
                  discount={discount}
                  loading={loading}
                  isLoggedIn={hasValidSession}
                  hasZipCode={Boolean(selectedShippingRate?.zipCode)}
                  onCheckout={handleProcessPayment}
                  deliveryDate={deliveryDate}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  checkoutData={checkoutData}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  // This will only show briefly while redirecting to cart
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecionando para o carrinho...</p>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Checkout;
