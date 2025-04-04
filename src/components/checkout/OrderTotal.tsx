
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CartItem } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Landmark, QrCode, Loader2 } from "lucide-react";
import QRCodeDisplay from "./payment/QRCodeDisplay";

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
  checkoutData: any;
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
  setPaymentMethod,
  checkoutData
}: OrderTotalProps) => {
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Calculate totals whenever inputs change
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    
    // Ensure shippingFee is a number
    const numericShippingFee = typeof shippingFee === 'number' ? shippingFee : parseFloat(String(shippingFee)) || 0;
    console.log('Shipping fee in OrderTotal:', numericShippingFee);
    
    setTotal(newSubtotal + numericShippingFee - discount);
  }, [cartItems, shippingFee, discount]);
  
  // Format delivery date if available
  const formattedDeliveryDate = deliveryDate
    ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(deliveryDate)
    : null;

  // Extract the PIX code from checkoutData, handling different possible structures
  const extractPixCode = () => {
    if (!checkoutData) return '';
    
    // Try all possible paths to get the PIX code
    if (checkoutData.point_of_interaction?.transaction_data?.qr_code) {
      return checkoutData.point_of_interaction.transaction_data.qr_code;
    }
    
    return checkoutData.pixCode || checkoutData.qr_code_text || '';
  };

  const pixCode = extractPixCode();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order summary section */}
        <div className="space-y-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Frete</span>
              <span>{hasZipCode ? formatCurrency(shippingFee) : "Calcular"}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Desconto</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        
        {/* Delivery info */}
        {hasZipCode && formattedDeliveryDate && (
          <div className="p-3 bg-primary/10 rounded-lg text-sm">
            <p>Previsão de entrega: até <strong>{formattedDeliveryDate}</strong></p>
          </div>
        )}
        
        {/* Payment method selection */}
        <div>
          <h3 className="font-medium mb-3">Forma de Pagamento</h3>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix" className="flex items-center cursor-pointer">
                <QrCode className="h-4 w-4 mr-2" />
                <span>PIX</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center cursor-pointer">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Cartão de Crédito</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center cursor-pointer">
                <Landmark className="h-4 w-4 mr-2" />
                <span>Transferência Bancária</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Checkout button or QR code display */}
        {!checkoutData ? (
          <Button 
            className="w-full" 
            onClick={onCheckout}
            disabled={loading || !isLoggedIn || !hasZipCode}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Finalizar Compra'
            )}
          </Button>
        ) : (
          <QRCodeDisplay 
            pixCode={pixCode}
            isLoading={loading}
          />
        )}
        
        {!isLoggedIn && (
          <p className="text-sm text-red-500">
            É necessário estar logado para finalizar a compra.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTotal;
