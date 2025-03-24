import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCart } from "@/hooks/use-cart";
import { useShipping } from "@/hooks/use-shipping";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OrderSummaryValues from "@/components/cart/OrderSummaryValues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentTabs from "@/components/checkout/PaymentTabs";
import { useCheckout } from "@/hooks/use-checkout";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { 
    zipCode, 
    setZipCode, 
    loading: isCalculatingShipping, 
    shippingRates,
    selectedShippingRate,
    shippingFee: shippingCost,
    calculateShipping,
    resetShipping,
    handleShippingRateChange
  } = useShipping();
  const { profile, isAuthenticated } = useAuth();
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("cart");
  
  // Checkout hooks
  const {
    loading: checkoutLoading,
    paymentMethod,
    setPaymentMethod,
    handleCheckout,
    orderId,
    checkoutData
  } = useCheckout();

  // Load user profile data if authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && profile?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profile.id)
            .single();
          
          if (error) throw error;
          if (data) {
            setUserProfile(data);
            // Pre-fill zip code from user profile
            if (data.zip_code && !zipCode) {
              setZipCode(data.zip_code);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, profile]);

  const handleZipCodeSubmit = async (zip: string) => {
    setShippingError(null);
    try {
      await calculateShipping(zip);
      setShippingCalculated(true);
      setActiveTab("payment");
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setShippingError("Não foi possível calcular o frete. Verifique o CEP e tente novamente.");
    }
  };

  const handleResetShipping = () => {
    resetShipping();
    setShippingCalculated(false);
    setShippingError(null);
  };

  const handleProcessPayment = () => {
    if (!isAuthenticated) {
      toast.error("É necessário estar logado para finalizar a compra");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!shippingCalculated || !selectedShippingRate) {
      toast.error("Por favor, calcule o frete antes de continuar");
      return;
    }
    
    handleCheckout(cartItems, zipCode, shippingCost || 0, 0, null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <EmptyCart />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Meu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="cart" className="flex-1">Itens do Carrinho</TabsTrigger>
                {shippingCalculated && (
                  <TabsTrigger value="payment" className="flex-1">Pagamento</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="cart">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium mb-4">Itens ({getTotalItems()})</h2>

                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeItem(item.id)}
                        onUpdateQuantity={(qty: number) => updateQuantity(item.id, qty)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentTabs 
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      processPayment={handleProcessPayment}
                      isProcessing={checkoutLoading}
                      pixCode={checkoutData?.point_of_interaction?.transaction_data?.qr_code || ""}
                      pixQrCodeImage={checkoutData?.point_of_interaction?.transaction_data?.qr_code_base64 || ""}
                      orderId={orderId || ""}
                      cartTotal={getTotalPrice() + (shippingCost || 0)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <CartSummary
              subtotal={getTotalPrice()}
              shippingCost={shippingCost || 0}
              total={(getTotalPrice() + (shippingCost || 0))}
              zipCode={zipCode}
              onZipCodeChange={(e) => setZipCode(e.target.value)}
              onCalculateShipping={() => handleZipCodeSubmit(zipCode)}
              isLoading={isCalculatingShipping}
              error={shippingError}
              shippingCalculated={shippingCalculated}
              onResetShipping={handleResetShipping}
              onCheckout={handleProcessPayment}
              shippingOptions={shippingRates}
              selectedShippingOption={selectedShippingRate}
              onShippingOptionChange={handleShippingRateChange}
            />
            
            {shippingCalculated && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <OrderSummaryValues 
                  cartItems={cartItems}
                  shippingCost={shippingCost}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Cart;
