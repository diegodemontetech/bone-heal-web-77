
import { addBusinessDays } from "date-fns";
import { ShippingCalculationRate } from "@/types/shipping";

export const useDeliveryDate = () => {
  const calculateDeliveryDate = (shippingRate: ShippingCalculationRate | null) => {
    if (!shippingRate) return null;
    
    const today = new Date();
    const deliveryDate = addBusinessDays(today, shippingRate.delivery_days);
    
    return deliveryDate;
  };

  return { calculateDeliveryDate };
};
