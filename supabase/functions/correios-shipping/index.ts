
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

// Helper function to get estimated delivery days based on zip code
const getDeliveryDays = (zipCode: string): { standard: number, express: number } => {
  // Extract the first 2 digits to determine the region
  const prefix = parseInt(zipCode.substring(0, 2));
  
  // Capitais e grandes centros (simplificação)
  if ([10, 11, 12, 13, 20, 21, 22, 30, 40, 50, 60, 70, 80, 90].includes(prefix)) {
    return { standard: 2, express: 1 }; // 1-2 dias úteis
  }
  
  // Sul e Sudeste (prefixos de 01 a 39)
  if (prefix >= 1 && prefix <= 39) {
    return { standard: 2, express: 1 }; // 1-2 dias úteis
  }
  
  // Nordeste e Centro-Oeste (prefixos de 40 a 65, 70 a 76, 78 a 79)
  if ((prefix >= 40 && prefix <= 65) || (prefix >= 70 && prefix <= 76) || (prefix >= 78 && prefix <= 79)) {
    return { standard: 3, express: 1 }; // 1-3 dias úteis
  }
  
  // Norte (prefixos de 66 a 69, 77)
  if ((prefix >= 66 && prefix <= 69) || prefix === 77) {
    return { standard: 5, express: 2 }; // 2-5 dias úteis
  }
  
  // Default para outros prefixos
  return { standard: 7, express: 3 }; // Valor padrão
};

serve(async (req) => {
  // Handle CORS preflight request first
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const body = await req.json();
    // Aceitamos tanto zipCode quanto zipCodeDestination para compatibilidade
    const zipCode = body.zipCode || body.zipCodeDestination;
    const items = body.items || [];
    
    console.log(`Calculando frete para CEP: ${zipCode} com ${items.length} itens`);
    
    // Validação básica do CEP
    if (!zipCode) {
      throw new Error("CEP não informado");
    }
    
    // Limpar o CEP para ter apenas números
    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      throw new Error("CEP inválido: deve conter 8 dígitos");
    }

    // Calcular peso total dos itens (se disponível)
    let totalWeight = 0;
    if (items.length > 0) {
      totalWeight = items.reduce((acc, item) => {
        // Garantindo que lidamos com a propriedade weight que pode não existir
        const itemWeight = item.weight || 0.5;  // Peso padrão de 0.5kg se não especificado
        const quantity = item.quantity || 1;    // Quantidade padrão 1 se não especificada
        return acc + (itemWeight * quantity);
      }, 0);
    } else {
      // Peso padrão se não houver itens
      totalWeight = 0.5;
    }
    
    console.log(`Peso total calculado: ${totalWeight}kg`);
    
    // Obter o prefixo do CEP para determinar a região
    const cepPrefix = parseInt(cleanZipCode.substring(0, 2));
    
    // Taxa base de frete por região (usando o prefixo do CEP)
    // Esta é uma simulação mais real, baseada em faixas de CEP
    const getBaseRateByRegion = (prefix: number) => {
      // Capitais e grandes centros (simplificação)
      if ([10, 11, 12, 13, 20, 21, 22, 30, 40, 50, 60, 70, 80, 90].includes(prefix)) {
        return 20; // Taxa base para grandes centros
      }
      
      // Sul e Sudeste (prefixos de 01 a 39)
      if (prefix >= 1 && prefix <= 39) {
        return 28;
      }
      
      // Centro-Oeste e Nordeste (prefixos de 40 a 65)
      if (prefix >= 40 && prefix <= 65) {
        return 35;
      }
      
      // Norte (prefixos de 66 a 69)
      if (prefix >= 66 && prefix <= 69) {
        return 42;
      }
      
      // Padrão para outros prefixos
      return 30;
    };
    
    const baseRate = getBaseRateByRegion(cepPrefix);
    
    // Garantir um fator de peso mínimo para evitar valores zerados
    const weightFactor = Math.max(1, totalWeight);
    
    // Garantir valor mínimo de frete (nunca zero)
    const calculateShippingRate = (baseCost: number, factor: number, multiplier: number = 1) => {
      const calculatedRate = Math.round(baseCost * factor * multiplier * 100) / 100;
      return Math.max(20, calculatedRate); // Mínimo de R$20
    };

    // Obter os prazos de entrega baseados no CEP
    const deliveryDays = getDeliveryDays(cleanZipCode);

    // Sempre retornar duas opções: PAC e SEDEX
    const shippingRates = [
      {
        id: "pac-" + cleanZipCode,
        service_type: "PAC",
        name: "PAC (Convencional)",
        rate: calculateShippingRate(baseRate, weightFactor),
        delivery_days: deliveryDays.standard,
        zipCode: cleanZipCode
      },
      {
        id: "sedex-" + cleanZipCode,
        service_type: "SEDEX",
        name: "SEDEX (Express)",
        rate: calculateShippingRate(baseRate, weightFactor, 1.7), // SEDEX é 70% mais caro que PAC
        delivery_days: deliveryDays.express,
        zipCode: cleanZipCode
      }
    ];

    console.log("Taxas de frete calculadas:", shippingRates);

    return new Response(
      JSON.stringify(shippingRates),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Erro na função correios-shipping:', error);
    
    // Obter o CEP da requisição, se disponível, para usar com os dados padrão
    let zipCode = "00000000";
    try {
      const body = await req.json();
      zipCode = (body.zipCode || body.zipCodeDestination || "00000000").replace(/\D/g, '');
    } catch (e) {
      // Ignora erros ao tentar ler o corpo novamente
    }
    
    // Mesmo em caso de erro, vamos retornar algumas opções padrão
    // com prazos de entrega mais realistas
    const defaultRates = [
      {
        id: "pac-default",
        service_type: "PAC",
        name: "PAC (Convencional)",
        rate: 30.00,
        delivery_days: 7, // Prazo padrão para PAC
        zipCode: zipCode
      },
      {
        id: "sedex-default",
        service_type: "SEDEX",
        name: "SEDEX (Express)",
        rate: 55.00,
        delivery_days: 3, // Prazo padrão para SEDEX
        zipCode: zipCode
      }
    ];
    
    return new Response(
      JSON.stringify(defaultRates),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  }
});
