
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface QuotationDetailsProps {
  quotation: any;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationDetails = ({ quotation, isOpen, onClose }: QuotationDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Orçamento #{quotation.id.slice(0, 8)}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status e Data */}
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(quotation.status)}>
              {quotation.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(quotation.created_at), "dd/MM/yyyy")}
            </span>
          </div>

          {/* Cliente */}
          {quotation.customer && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Cliente</h3>
              <div className="p-3 border rounded bg-gray-50">
                <p className="font-medium">{quotation.customer.full_name}</p>
                <p className="text-sm text-gray-600">{quotation.customer.email}</p>
                <p className="text-sm text-gray-600">{quotation.customer.phone}</p>
                {quotation.customer.address && (
                  <>
                    <p className="text-sm text-gray-600">{quotation.customer.address}</p>
                    <p className="text-sm text-gray-600">
                      {quotation.customer.city} - {quotation.customer.state}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Produtos */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Produtos</h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                {quotation.items?.map((item: any, index: number) => (
                  <div key={index} className="flex space-x-3">
                    {item.product_image && (
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border">
                        <img 
                          src={item.product_image} 
                          alt={item.product_name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qtd: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Pagamento */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Forma de Pagamento</h3>
            <p>{quotation.payment_method === 'pix' ? 'PIX' : 
               quotation.payment_method === 'credit_card' ? 'Cartão de Crédito' : 
               quotation.payment_method === 'boleto' ? 'Boleto Bancário' : 
               'Não especificado'}</p>
          </div>

          {/* Resumo */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Resumo</h3>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(quotation.subtotal_amount || 0)}</span>
                </div>
                
                {quotation.discount_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Desconto{quotation.discount_type === 'percentage' ? ' (%)' : ''}</span>
                    <span>-{formatCurrency(quotation.discount_amount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(quotation.total_amount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Observações */}
          {quotation.notes && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Observações</h3>
              <p className="text-sm text-gray-600">{quotation.notes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
