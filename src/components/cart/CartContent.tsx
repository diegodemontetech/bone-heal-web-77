
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { useShipping } from "@/hooks/use-shipping";
import { useCheckout } from "@/hooks/use-checkout";
import CartItemsSection from "@/components/cart/CartItemsSection";
import PaymentSection from "@/components/cart/PaymentSection";
import CartSummarySection from "@/components/cart/CartSummarySection";
import OrderSummaryValues from "@/components/cart/OrderSummaryValues";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";

interface CartContentProps {
  userProfile: any;
}

const CartContent = ({ userProfile }: CartContentProps) => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, getTotalItems } = useCart();
  const { profile, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("cart");
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  
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
  
  // Checkout hooks
  const {
    loading: checkoutLoading,
    paymentMethod,
    setPaymentMethod,
    handleCheckout,
    orderId,
    checkoutData
  } = useCheckout();

  // Pre-fill zip code from user profile
  useEffect(() => {
    if (userProfile?.zip_code && !zipCode) {
      setZipCode(userProfile.zip_code);
    }
  }, [userProfile, zipCode, setZipCode]);

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

  const handleProcessPayment = async () => {
    if (!isAuthenticated) {
      toast.error("É necessário estar logado para finalizar a compra");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!shippingCalculated || !selectedShippingRate) {
      toast.error("Por favor, calcule o frete antes de continuar");
      return;
    }
    
    try {
      await handleCheckout(cartItems, zipCode, shippingCost || 0, 0, null);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Ocorreu um erro ao processar o pagamento. Tente novamente.");
    }
  };

  return (
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
            <CartItemsSection cartItems={cartItems} itemCount={getTotalItems()} />
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentSection 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              handleProcessPayment={handleProcessPayment}
              checkoutLoading={checkoutLoading}
              checkoutData={checkoutData}
              orderId={orderId}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <CartSummarySection 
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
  );
};

export default CartContent;
