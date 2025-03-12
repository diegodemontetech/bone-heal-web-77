
import { useState } from "react";

export const useZipCodeFormatter = (initialZipCode: string = "") => {
  const [zipCode, setZipCode] = useState(initialZipCode);

  const formatZipCode = (value: string) => {
    // Remover caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Aplicar máscara de CEP (00000-000)
    let maskedValue = cleanValue;
    if (cleanValue.length > 5) {
      maskedValue = cleanValue.substring(0, 5) + '-' + cleanValue.substring(5);
    }
    
    return maskedValue.substring(0, 9);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatZipCode(e.target.value);
    setZipCode(formattedValue);
  };

  const isZipCodeValid = (code: string = zipCode) => {
    const cleanCode = code.replace(/\D/g, '');
    return cleanCode.length >= 8;
  };

  return {
    zipCode,
    setZipCode,
    handleZipCodeChange,
    isZipCodeValid,
    formatZipCode
  };
};
