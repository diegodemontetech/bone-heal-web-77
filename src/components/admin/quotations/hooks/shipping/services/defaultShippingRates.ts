
import { ShippingCalculationRate } from "@/types/shipping";
import { getDeliveryTimeByZipCode } from "@/lib/shipping/delivery-times";

export const createDefaultShippingRates = (
  zipCode: string
): ShippingCalculationRate[] => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  
  // Verificar a região do CEP com base nos dois primeiros dígitos
  const zipPrefix = Number(cleanZipCode.substring(0, 2));
  
  let pacRate = 25;
  let sedexRate = 45;
  
  // Obter prazo de entrega baseado no CEP
  const deliveryDays = getDeliveryTimeByZipCode(cleanZipCode);
  const pacDays = deliveryDays;
  const sedexDays = Math.max(1, Math.ceil(deliveryDays / 2)); // SEDEX é mais rápido
  
  // Ajustar valores com base na região
  if ([10, 11, 12, 13, 20, 21, 22, 30, 40, 50, 60, 70, 80, 90].includes(zipPrefix)) {
    // Grandes centros/capitais
    pacRate = 20;
    sedexRate = 35;
  } else if (zipPrefix >= 1 && zipPrefix <= 39) {
    // Sudeste/Sul
    pacRate = 28;
    sedexRate = 48;
  } else if (zipPrefix >= 40 && zipPrefix <= 65) {
    // Centro-Oeste/Nordeste
    pacRate = 35;
    sedexRate = 58;
  } else if (zipPrefix >= 66 && zipPrefix <= 69) {
    // Norte
    pacRate = 42;
    sedexRate = 68;
  }
  
  return [
    {
      id: 'default-pac',
      rate: pacRate,
      delivery_days: pacDays,
      service_type: 'PAC',
      name: 'PAC (Convencional)',
      zipCode: cleanZipCode
    },
    {
      id: 'default-sedex',
      rate: sedexRate,
      delivery_days: sedexDays,
      service_type: 'SEDEX',
      name: 'SEDEX (Express)',
      zipCode: cleanZipCode
    }
  ];
};
