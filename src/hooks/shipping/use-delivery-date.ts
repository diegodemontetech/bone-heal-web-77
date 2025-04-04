
import { addBusinessDays } from "date-fns";
import { ShippingCalculationRate } from "@/types/shipping";

export const useDeliveryDate = () => {
  const calculateDeliveryDate = (shippingRate: ShippingCalculationRate | null) => {
    if (!shippingRate) return null;
    
    // Get delivery days from the shipping rate
    const deliveryDays = shippingRate.delivery_days || 7;
    
    const today = new Date();
    const deliveryDate = addBusinessDays(today, deliveryDays);
    
    return deliveryDate;
  };

  return { calculateDeliveryDate };
};
