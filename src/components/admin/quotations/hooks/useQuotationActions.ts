
import { useState } from "react";
import { usePdfGenerator } from "./usePdfGenerator";
import { useOrderConverter } from "./useOrderConverter";
import { useShareWhatsApp } from "./useShareWhatsApp";
import { toast } from "sonner";

/**
 * Hook para gerenciar o estado de carregamento das ações de cotação
 */
const useActionLoadingState = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isConvertingToOrder, setIsConvertingToOrder] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  return {
    isGeneratingPdf,
    setIsGeneratingPdf,
    isConvertingToOrder,
    setIsConvertingToOrder,
    isSharing,
    setIsSharing
  };
};

/**
 * Hook para gerenciar ações relacionadas a PDF
 */
const usePdfActions = (setIsGeneratingPdf: (loading: boolean) => void) => {
  const { generatePdf } = usePdfGenerator();
  
  const handleDownloadPdf = async (quotationId: string) => {
    if (!quotationId) {
      toast.error("ID da cotação é inválido");
      return;
    }
    
    setIsGeneratingPdf(true);
    try {
      const pdfDoc = await generatePdf(quotationId);
      if (pdfDoc) {
        pdfDoc.save(`cotacao-${quotationId.substring(0, 8)}.pdf`);
        toast.success("PDF gerado com sucesso");
      } else {
        toast.error("Erro ao gerar PDF");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  return { handleDownloadPdf };
};

/**
 * Hook para gerenciar ações de conversão
 */
const useConversionActions = (setIsConvertingToOrder: (loading: boolean) => void) => {
  const { convertToOrder } = useOrderConverter();
  
  const handleConvertToOrder = async (quotationId: string) => {
    if (!quotationId) {
      toast.error("ID da cotação é inválido");
      return;
    }
    
    setIsConvertingToOrder(true);
    try {
      await convertToOrder(quotationId);
      toast.success("Cotação convertida em pedido com sucesso");
    } catch (error) {
      console.error("Erro ao converter cotação:", error);
      toast.error("Erro ao converter cotação em pedido");
    } finally {
      setIsConvertingToOrder(false);
    }
  };
  
  return { handleConvertToOrder };
};

/**
 * Hook para gerenciar ações de compartilhamento
 */
const useSharingActions = (setIsSharing: (loading: boolean) => void) => {
  const { shareViaWhatsApp } = useShareWhatsApp();
  
  const handleShareWhatsApp = async (quotationId: string) => {
    if (!quotationId) {
      toast.error("ID da cotação é inválido");
      return;
    }
    
    setIsSharing(true);
    try {
      await shareViaWhatsApp(quotationId);
    } catch (error) {
      console.error("Erro ao compartilhar via WhatsApp:", error);
      toast.error("Erro ao compartilhar via WhatsApp");
    } finally {
      setIsSharing(false);
    }
  };
  
  return { handleShareWhatsApp };
};

/**
 * Hook principal que combina todos os hooks de ações de cotação
 */
export const useQuotationActions = () => {
  // Estado de carregamento
  const {
    isGeneratingPdf,
    setIsGeneratingPdf,
    isConvertingToOrder,
    setIsConvertingToOrder,
    isSharing,
    setIsSharing
  } = useActionLoadingState();
  
  // Ações para PDF
  const { handleDownloadPdf } = usePdfActions(setIsGeneratingPdf);
  
  // Ações para conversão
  const { handleConvertToOrder } = useConversionActions(setIsConvertingToOrder);
  
  // Ações para compartilhamento
  const { handleShareWhatsApp } = useSharingActions(setIsSharing);
  
  // Retornar todas as funções e estados
  return {
    // Estados de carregamento
    isGeneratingPdf,
    isConvertingToOrder,
    isSharing,
    
    // Funções de ação
    handleDownloadPdf,
    handleConvertToOrder,
    handleShareWhatsApp
  };
};
