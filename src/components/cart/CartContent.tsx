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
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle, TruckIcon, CreditCard } from "lucide-react";
import { EmptyCart } from "@/components/cart/EmptyCart";

interface CartContentProps {
  userProfile: any;
}

const CartContent = ({ userProfile }: CartContentProps) => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, getTotalItems } = useCart();
  
  // Check if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart />;
  }
  
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
  
  const {
    loading: checkoutLoading,
    paymentMethod,
    setPaymentMethod,
    handleCheckout,
    orderId,
    checkoutData
  } = useCheckout();

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <Card className="overflow-hidden">
          <div className="border-b">
            <div className="flex items-center px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <h3 className="font-semibold">Entrega</h3>
              </div>
              {shippingCalculated && (
                <div className="ml-auto flex items-center text-green-600 gap-1 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Endereço selecionado</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`p-6 ${shippingCalculated ? 'opacity-50 pointer-events-none' : ''}`}>
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
          </div>
          
          {shippingCalculated && (
            <>
              <div className="border-t border-b">
                <div className="flex items-center px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                      2
                    </div>
                    <h3 className="font-semibold">Método de Pagamento</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <PaymentSection 
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  handleProcessPayment={handleProcessPayment}
                  checkoutLoading={checkoutLoading}
                  checkoutData={checkoutData}
                  orderId={orderId}
                />
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="lg:col-span-4">
        <Card className="p-6 sticky top-24">
          <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
          
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="h-16 w-16 bg-gray-50 rounded-md border overflow-hidden flex-shrink-0">
                  <img 
                    src={`/products/${item.image}`} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                  <p className="text-sm font-medium">{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{getTotalPrice().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entrega</span>
              <span>{shippingCalculated ? (shippingCost || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Calculando...'}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t mt-2">
              <span>Total</span>
              <span className="text-primary">{(getTotalPrice() + (shippingCost || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
          
          {shippingCalculated && selectedShippingRate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2">
              <TruckIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">{selectedShippingRate.label}</p>
                <p className="text-xs text-blue-600">
                  Entrega em {selectedShippingRate.days_min === selectedShippingRate.days_max 
                    ? `${selectedShippingRate.days_min} dia(s)` 
                    : `${selectedShippingRate.days_min}-${selectedShippingRate.days_max} dias`}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CartContent;
