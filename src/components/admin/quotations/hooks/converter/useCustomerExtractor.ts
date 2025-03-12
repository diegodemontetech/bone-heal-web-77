
import { Json } from "@/integrations/supabase/types";

// Interface para dados do cliente
interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  neighborhood?: string;
  cpf?: string;
}

export const useCustomerExtractor = () => {
  const extractCustomerInfo = (customerInfoRaw: Json): CustomerInfo => {
    if (!customerInfoRaw || typeof customerInfoRaw !== 'object') {
      throw new Error("Informações do cliente inválidas");
    }
    
    const customer: CustomerInfo = {
      id: '',
      name: ''
    };
    
    // Extrair dados do cliente com segurança
    if (typeof customerInfoRaw === 'object' && customerInfoRaw !== null && !Array.isArray(customerInfoRaw)) {
      const customerObj = customerInfoRaw as Record<string, Json>;
      customer.id = customerObj.id as string || '';
      customer.name = customerObj.name as string || '';
      customer.email = customerObj.email as string | undefined;
      customer.phone = customerObj.phone as string | undefined;
      customer.address = customerObj.address as string | undefined;
      customer.city = customerObj.city as string | undefined;
      customer.state = customerObj.state as string | undefined;
      customer.zip_code = customerObj.zip_code as string | undefined;
      customer.neighborhood = customerObj.neighborhood as string | undefined;
      customer.cpf = customerObj.cpf as string | undefined;
    }

    if (!customer.id || !customer.name) {
      throw new Error("Cliente não encontrado para este orçamento");
    }

    return customer;
  };

  const buildShippingAddress = (customer: CustomerInfo) => {
    return {
      name: customer.name,
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zip_code: customer.zip_code || '',
      neighborhood: customer.neighborhood || ''
    };
  };

  return { 
    extractCustomerInfo,
    buildShippingAddress
  };
};
