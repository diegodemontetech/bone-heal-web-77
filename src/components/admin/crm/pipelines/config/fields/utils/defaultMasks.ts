
// Funções utilitárias para máscaras de campos

/**
 * Retorna a máscara padrão para um tipo de campo específico
 */
export const getDefaultMask = (type: string): string => {
  switch (type) {
    case "phone":
      return "(99) 99999-9999";
    case "cpf":
      return "999.999.999-99";
    case "cnpj":
      return "99.999.999/9999-99";
    case "date":
      return "99/99/9999";
    case "cep":
      return "99999-999";
    default:
      return "";
  }
};
