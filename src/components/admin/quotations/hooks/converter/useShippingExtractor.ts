
import { Json } from "@/integrations/supabase/types";

// Interface para informações de frete
interface ShippingInfo {
  cost: number;
  method?: string;
  carrier?: string;
  estimated_days?: number;
  zipCode?: string;
  service_type?: string;
}

export const useShippingExtractor = () => {
  const extractShippingInfo = (shippingInfoRaw: Json): ShippingInfo => {
    const shippingInfo: ShippingInfo = {
      cost: 0
    };
    
    if (shippingInfoRaw && typeof shippingInfoRaw === 'object' && !Array.isArray(shippingInfoRaw)) {
      const shippingObj = shippingInfoRaw as Record<string, Json>;
      shippingInfo.cost = typeof shippingObj.cost === 'number' ? shippingObj.cost : 
                          typeof shippingObj.cost === 'string' ? parseFloat(shippingObj.cost) : 0;
      shippingInfo.method = shippingObj.method as string | undefined;
      shippingInfo.carrier = shippingObj.carrier as string | undefined;
      shippingInfo.estimated_days = shippingObj.estimated_days as number | undefined;
      shippingInfo.service_type = shippingObj.service_type as string | undefined;
      shippingInfo.zipCode = shippingObj.zip_code as string | undefined;
    }

    return shippingInfo;
  };

  return { extractShippingInfo };
};
