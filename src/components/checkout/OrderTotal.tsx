
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderSummary from "@/components/orders/OrderSummary";
import { Loader2, CreditCard, Banknote, QrCode } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderTotalProps {
  cartItems: CartItem[];
  shippingFee: number;
  discount: number;
  loading: boolean;
  isLoggedIn: boolean;
  hasZipCode: boolean;
  onCheckout: () => void;
  deliveryDate: Date | null;
}

const OrderTotal = ({
  cartItems,
  shippingFee,
  discount,
  loading,
  isLoggedIn,
  hasZipCode,
  onCheckout,
  deliveryDate,
}: OrderTotalProps) => {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingFee - discount;

  const calculateInstallments = (total: number) => {
    const installments = [];
    for (let i = 1; i <= 6; i++) {
      const value = total / i;
      installments.push({
        number: i,
        value,
        total: total
      });
    }
    return installments;
  };

  const pixDiscount = total * 0.05; // 5% de desconto no PIX
  const installments = calculateInstallments(total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderSummary
          items={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          total={total}
        />

        {deliveryDate && (
          <p className="text-sm text-gray-600 mt-4">
            Receba até {format(deliveryDate, "dd 'de' MMMM", { locale: ptBR })}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-medium">Formas de Pagamento</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span>PIX à vista</span>
                </div>
                <div className="text-green-600 font-medium">
                  R$ {(total - pixDiscount).toFixed(2)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  <span>Boleto à vista</span>
                </div>
                <div className="font-medium">
                  R$ {total.toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão de Crédito</span>
                </div>
                <div className="text-sm space-y-1">
                  {installments.map((installment) => (
                    <div key={installment.number} className="flex justify-between">
                      <span>{installment.number}x de</span>
                      <span>R$ {installment.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={onCheckout}
            disabled={loading || !isLoggedIn}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Finalizar Compra"
            )}
          </Button>

          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground text-center">
              Entre em sua conta para finalizar a compra
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTotal;
