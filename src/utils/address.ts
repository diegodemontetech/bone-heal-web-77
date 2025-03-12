
import { toast } from "sonner";

interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const fetchAddressFromCep = async (cep: string): Promise<AddressData | null> => {
  try {
    if (!cep || cep.length !== 8) {
      throw new Error("CEP inválido");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.erro) {
      throw new Error("CEP não encontrado");
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    toast.error(`Erro ao buscar CEP: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return null;
  }
};

export const formatCEP = (cep: string): string => {
  // Remove tudo que não for número
  const numericCep = cep.replace(/\D/g, '');
  
  // Formata como #####-###
  if (numericCep.length <= 5) {
    return numericCep;
  }
  
  return `${numericCep.slice(0, 5)}-${numericCep.slice(5, 8)}`;
};

export const unformatCEP = (cep: string): string => {
  return cep.replace(/\D/g, '');
};
