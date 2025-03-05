
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import OrderSummary from "@/components/orders/OrderSummary";
import { Loader2, CreditCard, Wallet, QrCode, ArrowRight } from "lucide-react";
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
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
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
  paymentMethod,
  setPaymentMethod
}: OrderTotalProps) => {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingFee - discount;

  const calculateInstallments = (total: number) => {
    const installments = [];
    for (let i = 1; i <= 12; i++) {
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
    <Card className="bg-white shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-primary">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <OrderSummary
          items={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          total={getFinalAmount(paymentMethod)}
        />

        {deliveryDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              Receba até {format(deliveryDate, "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium text-primary border-b pb-2">Forma de Pagamento</h4>
            
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="gap-4"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Cartão de Crédito</span>
                  </div>
                  {paymentMethod === 'credit' && (
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                      {installments.slice(0, 6).map((installment) => (
                        <div key={installment.number} className="flex justify-between">
                          <span>{installment.number}x de</span>
                          <span className="font-medium">R$ {installment.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-primary" />
                    <span>PIX</span>
                    <span className="text-green-600 text-sm font-medium ml-auto">
                      5% de desconto
                    </span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="mt-2 text-sm">
                      <div className="p-2 bg-green-50 rounded border border-green-100">
                        <div className="flex justify-between">
                          <span>Total com desconto:</span>
                          <span className="text-green-600 font-medium">
                            R$ {(total - pixDiscount).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Você economiza R$ {pixDiscount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="boleto" id="boleto" />
                <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span>Boleto Bancário</span>
                  </div>
                  {paymentMethod === 'boleto' && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">R$ {total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        O boleto vence em 3 dias úteis
                      </p>
                    </div>
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base"
            size="lg"
            onClick={onCheckout}
            disabled={loading || !isLoggedIn || !hasZipCode}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : !isLoggedIn ? (
              "Entre em sua conta para finalizar a compra"
            ) : !hasZipCode ? (
              "Aguarde o cálculo do frete"
            ) : (
              <>
                Pagar {getFinalAmount(paymentMethod).toFixed(2)} 
                {paymentMethod === 'credit' ? ' com Cartão' : 
                 paymentMethod === 'pix' ? ' com PIX' : 
                 ' com Boleto'} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {!isLoggedIn && (
            <p className="text-sm text-gray-600 text-center">
              Entre em sua conta para finalizar a compra
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTotal;
