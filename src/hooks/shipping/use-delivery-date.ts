
import { addBusinessDays } from "date-fns";
import { ShippingCalculationRate } from "@/types/shipping";

export const useDeliveryDate = () => {
  const calculateDeliveryDate = (shippingRate: ShippingCalculationRate | null) => {
    if (!shippingRate) return null;
    
    // Se não temos delivery_days, usar um valor padrão baseado no tipo de serviço
    let deliveryDays = shippingRate.delivery_days;
    
    if (!deliveryDays) {
      // Valores padrão por tipo de frete
      deliveryDays = shippingRate.service_type === "SEDEX" ? 3 : 7;
    }
    
    const today = new Date();
    const deliveryDate = addBusinessDays(today, deliveryDays);
    
    return deliveryDate;
  };

  return { calculateDeliveryDate };
};
