
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { QuotationHeader } from "./details/QuotationHeader";
import { CustomerSection } from "./details/CustomerSection";
import { ProductsSection } from "./details/ProductsSection";
import { PaymentSection } from "./details/PaymentSection";
import { ShippingSection } from "./details/ShippingSection";
import { SummarySection } from "./details/SummarySection";
import { NotesSection } from "./details/NotesSection";

interface QuotationDetailsProps {
  quotation: any;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationDetails = ({ quotation, isOpen, onClose }: QuotationDetailsProps) => {
  // Calcular o frete final baseado no shipping_info
  const getShippingCost = () => {
    if (quotation.shipping_info && quotation.shipping_info.cost) {
      return Number(quotation.shipping_info.cost);
    }
    return 0;
  };

  // Garantir que todos os valores numéricos são válidos
  const subtotal = Number(quotation.subtotal_amount) || 0;
  const discount = Number(quotation.discount_amount) || 0;
  const shipping = getShippingCost();
  const total = Number(quotation.total_amount) || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Orçamento #{quotation.id.slice(0, 8)}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status e Data */}
          <QuotationHeader 
            id={quotation.id} 
            status={quotation.status} 
            createdAt={quotation.created_at} 
          />

          {/* Cliente */}
          <CustomerSection customerInfo={quotation.customer_info} />

          {/* Produtos */}
          <ProductsSection items={quotation.items || []} />

          {/* Pagamento */}
          <PaymentSection paymentMethod={quotation.payment_method} />

          {/* Frete */}
          <ShippingSection shippingInfo={quotation.shipping_info} />

          {/* Resumo */}
          <SummarySection 
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            discountType={quotation.discount_type}
          />

          {/* Observações */}
          <NotesSection notes={quotation.notes} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
