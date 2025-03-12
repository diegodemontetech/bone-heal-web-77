
import { useState } from "react";

export const useZipCodeFormatter = (initialZipCode: string = "") => {
  // Função de formatação de CEP
  const formatZipCode = (value: string) => {
    const digits = value.replace(/\D/g, "");
    
    if (digits.length <= 5) {
      return digits;
    }
    
    return `${digits.substring(0, 5)}-${digits.substring(5, 8)}`;
  };

  const [zipCode, setZipCode] = useState(
    initialZipCode ? formatZipCode(initialZipCode) : ""
  );

  // Handler para entrada de CEP
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZipCode(formatZipCode(value));
  };

  // Verificar se o CEP é válido (8 dígitos)
  const isZipCodeValid = () => {
    const digits = zipCode.replace(/\D/g, "");
    return digits.length === 8;
  };

  // Obter apenas os dígitos do CEP
  const getCleanZipCode = () => {
    return zipCode.replace(/\D/g, "");
  };

  return {
    zipCode,
    setZipCode,
    handleZipCodeChange,
    isZipCodeValid,
    formatZipCode,
    getCleanZipCode
  };
};
