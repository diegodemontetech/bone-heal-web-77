
import { useState } from "react";
import { usePdfGenerator } from "./usePdfGenerator";
import { useOrderConverter } from "./useOrderConverter";
import { useShareWhatsApp } from "./useShareWhatsApp";

export const useQuotationActions = () => {
  // Estados para controlar carregamentos
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Hooks para ações
  const { generatePdf } = usePdfGenerator();
  const { convertToOrder } = useOrderConverter();
  const { shareViaWhatsApp } = useShareWhatsApp();
  
  // Funções para encapsular os hooks com gestão de estado
  const handleDownloadPdf = async (quotationId: string) => {
    setIsGeneratingPdf(true);
    try {
      await generatePdf(quotationId);
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  const handleConvertToOrder = async (quotationId: string) => {
    setIsConvertingToOrder(true);
    try {
      await convertToOrder(quotationId);
    } finally {
      setIsConvertingToOrder(false);
    }
  };
  
  const handleShareWhatsApp = async (quotationId: string) => {
    setIsSharing(true);
    try {
      await shareViaWhatsApp(quotationId);
    } finally {
      setIsSharing(false);
    }
  };
  
  // Retornar todas as funções e estados
  return {
    isGeneratingPdf,
    isConvertingToOrder,
    isSharing,
    handleDownloadPdf,
    handleConvertToOrder,
    handleShareWhatsApp
  };
};
