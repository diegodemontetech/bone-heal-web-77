
import { addBusinessDays } from "date-fns";
import { ShippingCalculationRate } from "@/types/shipping";

export const useDeliveryDate = () => {
  const calculateDeliveryDate = (shippingRate: ShippingCalculationRate | null) => {
    if (!shippingRate) return null;
    
    // Get delivery_days from the shipping rate or use fallback values
    let deliveryDays = shippingRate.delivery_days;
    
    if (!deliveryDays || isNaN(deliveryDays)) {
      // Default values based on shipping type
      deliveryDays = shippingRate.service_type === "SEDEX" ? 3 : 7;
    }
    
    const today = new Date();
    const deliveryDate = addBusinessDays(today, deliveryDays);
    
    return deliveryDate;
  };

  return { calculateDeliveryDate };
};
