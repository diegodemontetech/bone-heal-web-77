
import { useCallback } from "react";
import { toast } from "sonner";
import { parseJsonObject } from "@/utils/supabaseJsonUtils";

export const useShareWhatsApp = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const shareViaWhatsApp = useCallback((quotation) => {
    if (!quotation) {
      toast.error('Cotação inválida para compartilhamento');
      return;
    }

    try {
      // Extrair dados
      const customerData = quotation.customer_data || {};
      const products = quotation.products || [];
      
      let shipping = {};
      if (quotation.shipping_method) {
        if (typeof quotation.shipping_method === 'string') {
          shipping = parseJsonObject(quotation.shipping_method, {});
        } else if (typeof quotation.shipping_method === 'object') {
          shipping = quotation.shipping_method;
        }
      }

      // Calcular totais
      const subtotal = quotation.subtotal || 0;
      const discount = quotation.discount || 0;
      const shippingCost = quotation.shipping_cost || 0;
      const total = quotation.total || subtotal - discount + shippingCost;

      // Criar mensagem
      let message = `*Cotação Boneheal #${quotation.id.substring(0, 8)}*\n\n`;
      
      // Dados do cliente
      message += `*Cliente:* ${customerData.name || 'N/A'}\n`;
      
      // Produtos
      message += `\n*Produtos:*\n`;
      products.forEach((product, index) => {
        message += `${index + 1}. ${product.name} (${product.quantity}x) - ${formatCurrency(product.price)}\n`;
      });
      
      // Resumo
      message += `\n*Resumo:*\n`;
      message += `Subtotal: ${formatCurrency(subtotal)}\n`;
      
      if (discount > 0) {
        message += `Desconto: ${formatCurrency(discount)}\n`;
      }
      
      if (shippingCost > 0) {
        const shippingName = shipping && (shipping as any).name ? (shipping as any).name : 'Frete';
        message += `${shippingName}: ${formatCurrency(shippingCost)}\n`;
      }
      
      message += `\n*Total: ${formatCurrency(total)}*\n`;
      
      // Observações
      if (quotation.notes) {
        message += `\n*Observações:*\n${quotation.notes}\n`;
      }
      
      // Adicionar data
      const date = new Date(quotation.created_at).toLocaleDateString('pt-BR');
      message += `\n_Cotação gerada em ${date}_`;
      
      // Preparar URL
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      
      // Abrir URL
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Erro ao compartilhar via WhatsApp:", error);
      toast.error("Erro ao preparar mensagem para WhatsApp");
    }
  }, []);

  return { shareViaWhatsApp };
};
