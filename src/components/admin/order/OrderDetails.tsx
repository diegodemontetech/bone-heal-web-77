
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clipboard, Loader2 } from "lucide-react";
import { CustomerDisplay } from "./CustomerDisplay";
import { toast } from "sonner";

interface OrderDetailsProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetails = ({ order, isOpen, onClose }: OrderDetailsProps) => {
  const [copying, setCopying] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sincronizado': return 'bg-green-100 text-green-800';
      case 'sincronizando': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const copyPaymentLink = async () => {
    if (!order.mp_preference_id) {
      toast.error("Link de pagamento não disponível");
      return;
    }

    try {
      setCopying(true);
      const link = `${window.location.origin}/checkout/${order.id}`;
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado com sucesso!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    } finally {
      setCopying(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Pedido #{order.id.slice(0, 8)}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status e Data */}
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(order.omie_status)}>
              {order.omie_status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Cliente */}
          {order.profiles && (
            <CustomerDisplay customer={order.profiles} />
          )}

          {/* Produtos */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Produtos</h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Resumo</h3>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                {order.shipping_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>{formatCurrency(order.shipping_fee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações de Pagamento */}
          {order.mp_preference_id && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Link de Pagamento</h3>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={copyPaymentLink}
                disabled={copying}
              >
                {copying ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Clipboard className="w-4 h-4 mr-2" />
                )}
                Copiar Link
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
