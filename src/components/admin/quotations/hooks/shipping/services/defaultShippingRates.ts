
import { ShippingCalculationRate } from "@/types/shipping";

export const createDefaultShippingRates = (
  zipCode: string
): ShippingCalculationRate[] => {
  const cleanZipCode = zipCode.replace(/\D/g, '');
  
  // Verificar a região do CEP com base nos dois primeiros dígitos
  const zipPrefix = Number(cleanZipCode.substring(0, 2));
  
  let pacRate = 25;
  let sedexRate = 45;
  let pacDays = 7;
  let sedexDays = 2;
  
  // Ajustar valores com base na região
  if ([10, 11, 12, 13, 20, 21, 22, 30, 40, 50, 60, 70, 80, 90].includes(zipPrefix)) {
    // Grandes centros/capitais
    pacRate = 20;
    sedexRate = 35;
    pacDays = 5;
    sedexDays = 2;
  } else if (zipPrefix >= 1 && zipPrefix <= 399) {
    // Sudeste/Sul
    pacRate = 28;
    sedexRate = 48;
    pacDays = 6;
    sedexDays = 3;
  } else if (zipPrefix >= 400 && zipPrefix <= 659) {
    // Centro-Oeste/Nordeste
    pacRate = 35;
    sedexRate = 58;
    pacDays = 8;
    sedexDays = 4;
  } else if (zipPrefix >= 660 && zipPrefix <= 699) {
    // Norte
    pacRate = 42;
    sedexRate = 68;
    pacDays = 10;
    sedexDays = 5;
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
