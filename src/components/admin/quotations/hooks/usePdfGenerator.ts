
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { 
  addHeader,
  addQuotationInfo,
  addCustomerInfo,
  addPaymentInfo,
  addProductsTable,
  addSummary,
  addNotes,
  addFooter
} from "./pdf/pdfSections";
import type { QuotationData, EnhancedItem } from "./pdf/types";

export const usePdfGenerator = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const enhanceItems = async (items: any[]): Promise<EnhancedItem[]> => {
    return Promise.all(items.map(async (item: any) => {
      let productImage;
      if (item.product_id) {
        const { data: product } = await supabase
          .from("products")
          .select("main_image, default_image_url")
          .eq("id", item.product_id)
          .single();
        productImage = product?.main_image || product?.default_image_url;
      }
      
      return {
        product_name: item.product_name || "Produto sem nome",
        quantity: Number(item.quantity) || 0,
        unit_price: Number(item.unit_price) || 0,
        total_price: Number(item.total_price) || Number(item.unit_price) * Number(item.quantity) || 0,
        product_image: productImage
      };
    }));
  };

  const fetchQuotationData = async (quotationId: string): Promise<QuotationData> => {
    const { data: quotation, error } = await supabase
      .from("quotations")
      .select("*, customer:profiles(full_name, email, phone, address, city, state, zip_code, cnpj, cpf)")
      .eq("id", quotationId)
      .single();

    if (error) throw error;
    if (!quotation) throw new Error("Orçamento não encontrado");

    return {
      ...quotation,
      subtotal_amount: Number(quotation.subtotal_amount) || 0,
      discount_amount: Number(quotation.discount_amount) || 0,
      shipping_info: {
        cost: quotation.shipping_info?.cost ? Number(quotation.shipping_info.cost) : 0
      },
      total_amount: Number(quotation.total_amount) || 0
    };
  };

  const generatePdf = async (quotationId: string) => {
    setIsGeneratingPdf(true);
    try {
      const quotation = await fetchQuotationData(quotationId);
      const enhancedItems = await enhanceItems(quotation.items || []);
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;
      
      // Adicionar seções do PDF
      yPos = addHeader(doc, pageWidth, yPos);
      yPos = addQuotationInfo(doc, quotation, margin, yPos);
      yPos = addCustomerInfo(doc, quotation.customer, margin, yPos);
      yPos = addPaymentInfo(doc, quotation.payment_method, margin, yPos);
      yPos = addProductsTable(doc, enhancedItems, margin, yPos);
      yPos = addSummary(
        doc, 
        quotation.subtotal_amount,
        quotation.discount_amount,
        quotation.shipping_info?.cost || 0,
        quotation.total_amount,
        pageWidth,
        margin,
        yPos
      );
      yPos = addNotes(doc, quotation.notes, margin, pageWidth, yPos);
      addFooter(doc, pageWidth);

      // Salvar o PDF
      doc.save(`orcamento-${quotation.id.substring(0, 8)}.pdf`);
      
      toast.success("PDF gerado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Não foi possível gerar o PDF do orçamento");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    isGeneratingPdf,
    generatePdf
  };
};
