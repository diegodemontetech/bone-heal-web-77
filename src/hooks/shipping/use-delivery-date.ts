
import { addBusinessDays } from "date-fns";
import { ShippingCalculationRate } from "@/types/shipping";

export const useDeliveryDate = () => {
  const calculateDeliveryDate = (shippingRate: ShippingCalculationRate | null) => {
    if (!shippingRate) return null;
    
    // Default to 7 days if delivery_days is not defined
    const deliveryDays = shippingRate.delivery_days || 7;
    
    const today = new Date();
    const deliveryDate = addBusinessDays(today, deliveryDays);
    
    return deliveryDate;
  };

  return { calculateDeliveryDate };
};
