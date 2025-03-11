
import { usePdfGenerator } from "./usePdfGenerator";
import { useOrderConverter } from "./useOrderConverter";
import { useShareWhatsApp } from "./useShareWhatsApp";

export const useQuotationActions = () => {
  const { isGeneratingPdf, generatePdf } = usePdfGenerator();
  const { isConvertingToOrder, convertToOrder } = useOrderConverter();
  const { isSharing, shareViaWhatsApp } = useShareWhatsApp();
  
  // Retornar todas as funções e estados
  return {
    isGeneratingPdf,
    isConvertingToOrder,
    isSharing,
    handleDownloadPdf: generatePdf,
    handleConvertToOrder: convertToOrder,
    handleShareWhatsApp: shareViaWhatsApp
  };
};
