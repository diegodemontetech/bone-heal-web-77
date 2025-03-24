
import { Card, CardContent } from "@/components/ui/card";
import OrderSummary from "@/components/orders/OrderSummary";
import { CartItem } from "@/hooks/use-cart";
import PaymentOptions from "./payment/PaymentOptions";
import DeliveryInfo from "./payment/DeliveryInfo";
import CheckoutButton from "./payment/CheckoutButton";
import { ShoppingBag, Truck, BadgePercent, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderTotalProps {
  cartItems: CartItem[];
  shippingFee: number;
  discount: number;
  loading: boolean;
  isLoggedIn: boolean;
  hasZipCode: boolean;
  onCheckout: () => void;
  deliveryDate: Date | null;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  checkoutData: any;
}

// Define the type for commercial condition from database
interface CommercialConditionFromDB {
  id: string;
  name: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_amount: number | null;
  min_items: number | null;
  valid_from: string | null;
  valid_until: string | null;
  payment_method: string | null;
  region: string | null;
  customer_group: string | null;
  product_id: string | null;
  product_category: string | null;
  is_active: boolean | null;
  free_shipping: boolean | null;
  created_at: string;
  updated_at: string;
  is_cumulative?: boolean; // Make this optional to handle both cases
}

const OrderTotal = ({
  cartItems,
  shippingFee,
  discount,
  loading,
  isLoggedIn,
  hasZipCode,
  onCheckout,
  deliveryDate,
  paymentMethod,
  setPaymentMethod,
  checkoutData
}: OrderTotalProps) => {
  const [commercialDiscounts, setCommercialDiscounts] = useState<number>(0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Calculate commercial conditions discounts
  useEffect(() => {
    const calculateDiscounts = async () => {
      if (!checkoutData || !checkoutData.address) return;
      
      try {
        // Get all active commercial conditions
        const { data: conditions, error } = await supabase
          .from("commercial_conditions")
          .select("*")
          .eq("is_active", true);
        
        if (error) {
          console.error("Error fetching commercial conditions:", error);
          return;
        }
        
        if (!conditions || conditions.length === 0) return;
        
        // Filter applicable conditions and calculate discounts
        let totalDiscount = 0;
        const applicableConditions = conditions.filter((condition: CommercialConditionFromDB) => {
          // Check region condition (from zip code)
          if (condition.region && checkoutData.address.state && 
              condition.region !== checkoutData.address.state) {
            return false;
          }
          
          // Check payment method condition
          if (condition.payment_method && condition.payment_method !== paymentMethod) {
            return false;
          }
          
          // Check minimum amount
          if (condition.min_amount && subtotal < condition.min_amount) {
            return false;
          }
          
          // Check minimum items
          if (condition.min_items && cartItems.reduce((total, item) => total + item.quantity, 0) < condition.min_items) {
            return false;
          }
          
          // Add more conditions as needed
          
          return true;
        });
        
        // Calculate total discount
        let cumulativeDiscount = 0;
        let highestNonCumulativeDiscount = 0;
        
        applicableConditions.forEach((condition: CommercialConditionFromDB) => {
          const discountAmount = condition.discount_type === 'percentage' 
            ? (subtotal * condition.discount_value / 100) 
            : condition.discount_value;
            
          // Use optional chaining and nullish coalescing to safely handle is_cumulative
          if (condition.is_cumulative ?? true) {
            cumulativeDiscount += discountAmount;
          } else if (discountAmount > highestNonCumulativeDiscount) {
            highestNonCumulativeDiscount = discountAmount;
          }
        });
        
        totalDiscount = cumulativeDiscount + highestNonCumulativeDiscount;
        setCommercialDiscounts(totalDiscount);
        
      } catch (error) {
        console.error("Error calculating commercial discounts:", error);
      }
    };
    
    calculateDiscounts();
  }, [cartItems, checkoutData, paymentMethod, subtotal]);
  
  const total = subtotal + shippingFee - discount - commercialDiscounts;

  const getFinalAmount = (method: string) => {
    // We already accounted for all discounts, including payment method ones
    return total;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-white border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Resumo do Pedido
          </h2>
        </div>
        
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium pb-2 border-b">
              <ShoppingBag className="h-4 w-4" />
              <span>Itens do Carrinho</span>
            </div>
            
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount + commercialDiscounts}
              total={getFinalAmount(paymentMethod)}
            />

            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium pt-2 pb-2 border-b border-t">
              <Truck className="h-4 w-4" />
              <span>Entrega</span>
            </div>
            
            <DeliveryInfo deliveryDate={deliveryDate} />

            <div className="flex items-center gap-2 text-primary/70 text-sm font-medium pt-2 pb-2 border-b">
              <BadgePercent className="h-4 w-4" />
              <span>Formas de Pagamento</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentOptions 
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        total={total}
        checkoutData={checkoutData}
      />

      <div className="mt-6">
        <CheckoutButton 
          isLoggedIn={isLoggedIn}
          hasZipCode={hasZipCode}
          loading={loading}
          amount={getFinalAmount(paymentMethod)}
          paymentMethod={paymentMethod}
          onCheckout={onCheckout}
        />
      </div>
    </div>
  );
};

export default OrderTotal;
