
import { ShippingCalculationRate } from "@/types/shipping";

export const fetchShippingRatesFromAPI = async (
  zipCode: string
): Promise<ShippingCalculationRate[]> => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  
  try {
    console.log(`Consultando API de frete para o CEP ${cleanZipCode}`);
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/correios-shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipCode: cleanZipCode,
        items: [] // Enviar lista vazia, a API usará um peso padrão
      }),
    });
    
    if (!response.ok) {
      console.error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
      throw new Error(`Falha ao calcular o frete: ${response.status}`);
    }
    
    // Processar a resposta da API
    const apiRates = await response.json();
    console.log("Resposta da API de frete:", apiRates);
    
    // Mapear para nosso formato
    return apiRates.map((rate: any, index: number) => ({
      id: `api-${index}`,
      rate: rate.rate || 25, // Usar o valor real retornado pela API
      delivery_days: rate.delivery_days || 5,
      service_type: rate.service_type || 'PAC',
      name: rate.name || rate.service_type || 'Padrão',
      zipCode: cleanZipCode
    }));
  } catch (error) {
    console.error("Erro ao buscar frete da API:", error);
    throw error;
  }
};
