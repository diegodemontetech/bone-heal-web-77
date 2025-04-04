
import React, { useEffect, useState, useRef } from 'react';
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
import { useShipping } from '@/hooks/shipping';
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
  const hasLoadedProfileRef = useRef(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const shippingCalculationAttempted = useRef(false);
  const autoShippingCalculated = useRef(false);
  
  // Shipping and payment states
  const { paymentMethod, setPaymentMethod, checkoutData, loading, handleCheckout, orderId } = useCheckout();
  const { 
    shippingRates, 
    selectedShippingRate, 
    setZipCode, 
    calculateShipping, 
    shippingFee, 
    deliveryDate, 
    handleShippingRateChange,
    zipCode
  } = useShipping();

  console.log("Current shipping fee:", shippingFee, "Selected rate:", selectedShippingRate);

  // Fetch user profile once when session is available
  useEffect(() => {
    // If we've already loaded or are currently loading the profile, or don't have a session, exit
    if (hasLoadedProfileRef.current || !session?.user?.id) return;
    
    const loadUserProfile = async () => {
      // Mark that we've attempted to load the profile
      hasLoadedProfileRef.current = true;
      
      try {
        setIsLoadingProfile(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        setUserProfile(data);
          
        // Set zip code and calculate shipping if available
        if (data?.zip_code) {
          const cleanZipCode = data.zip_code.replace(/\D/g, '');
          
          if (cleanZipCode.length === 8) {
            setZipCode(cleanZipCode);
            console.log('Setting zip code from profile:', cleanZipCode);
            
            // Automatically calculate shipping if we have a valid zipcode
            if (!autoShippingCalculated.current) {
              autoShippingCalculated.current = true;
              try {
                console.log('Auto-calculating shipping with profile zipcode');
                const result = await calculateShipping(cleanZipCode);
                if (result.success) {
                  setShippingCalculated(true);
                  shippingCalculationAttempted.current = true;
                  toast.success("Frete calculado automaticamente");
                }
              } catch (error) {
                console.error("Erro ao calcular frete automaticamente:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadUserProfile();
  }, [session?.user?.id, setZipCode, calculateShipping]);

  // Redirect to cart if cart is empty, but only after initialization
  useEffect(() => {
    if (isInitialized && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [isInitialized, cartItems, navigate]);

  // Process checkout handler
  const handleProcessPayment = () => {
    if (!hasValidSession) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    console.log("Processing payment with shipping fee:", shippingFee);
    
    if (!selectedShippingRate) {
      // If we have a valid zip code but haven't calculated shipping yet, do it automatically
      if (zipCode && zipCode.length === 8 && !shippingCalculated && !shippingCalculationAttempted.current) {
        shippingCalculationAttempted.current = true;
        calculateShipping(zipCode).then(result => {
          if (result.success) {
            setShippingCalculated(true);
            // Show a message to the user
            toast.success("Frete calculado automaticamente");
            // Try again after shipping is calculated
            setTimeout(() => handleProcessPayment(), 500);
          }
        });
        // Return early to wait for shipping calculation
        return;
      } else if (!zipCode || zipCode.length !== 8) {
        toast.error("É necessário ter um CEP válido para finalizar a compra");
        return;
      } else if (!shippingFee || shippingFee <= 0) {
        toast.error("Erro ao calcular o frete. Por favor, tente novamente.");
        return;
      }
    }

    // Ensure we have a valid shipping fee
    if (!shippingFee || shippingFee <= 0) {
      if (selectedShippingRate) {
        const numericRate = parseFloat(String(selectedShippingRate.rate));
        if (!isNaN(numericRate) && numericRate > 0) {
          // Use the rate from the selected shipping option if shippingFee is not set correctly
          handleCheckout(
            cartItems,
            zipCode,
            numericRate,
            discount,
            appliedVoucher
          );
          return;
        }
      }
      
      toast.error("Erro ao calcular o frete. Por favor, tente novamente.");
      return;
    }
    
    handleCheckout(
      cartItems,
      zipCode,
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
                  hasZipCode={Boolean(zipCode && zipCode.length === 8 && shippingFee > 0)}
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
