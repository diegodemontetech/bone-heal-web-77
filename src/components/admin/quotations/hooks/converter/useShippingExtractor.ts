
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
    // Valor padrão
    const shippingInfo: ShippingInfo = { cost: 0 };
    
    // Se temos informações de frete válidas
    if (shippingInfoRaw && typeof shippingInfoRaw === 'object' && !Array.isArray(shippingInfoRaw)) {
      const shippingObj = shippingInfoRaw as Record<string, Json>;
      
      // Extrair custo, convertendo para número se necessário
      shippingInfo.cost = typeof shippingObj.cost === 'number' ? shippingObj.cost : 
                          typeof shippingObj.cost === 'string' ? parseFloat(shippingObj.cost) : 0;
      
      // Extrair outras propriedades
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
