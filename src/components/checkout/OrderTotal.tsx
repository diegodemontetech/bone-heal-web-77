
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import OrderSummary from "@/components/orders/OrderSummary";
import { Loader2, CreditCard, Wallet, QrCode } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");
  
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

  const getFinalAmount = (method: string) => {
    switch (method) {
      case 'pix':
        return total - pixDiscount;
      default:
        return total;
    }
  };

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
          total={getFinalAmount(paymentMethod)}
        />

        {deliveryDate && (
          <p className="text-sm text-gray-600 mt-4">
            Receba até {format(deliveryDate, "dd 'de' MMMM", { locale: ptBR })}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium">Forma de Pagamento</h4>
            
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="gap-4"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cartão de Crédito</span>
                  </div>
                  {paymentMethod === 'credit' && (
                    <div className="mt-2 text-sm space-y-1 text-gray-600">
                      {installments.map((installment) => (
                        <div key={installment.number} className="flex justify-between">
                          <span>{installment.number}x de</span>
                          <span>R$ {installment.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    <span>PIX</span>
                    <span className="text-green-600 text-sm ml-auto">
                      5% de desconto
                    </span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total com desconto:</span>
                        <span className="text-green-600 font-medium">
                          R$ {(total - pixDiscount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="boleto" id="boleto" />
                <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Boleto Bancário</span>
                  </div>
                  {paymentMethod === 'boleto' && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>R$ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </Label>
              </div>
            </RadioGroup>
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
              <>
                Pagar {paymentMethod === 'credit' ? 'com Cartão' : 
                       paymentMethod === 'pix' ? 'com PIX' : 
                       'com Boleto'}
              </>
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
