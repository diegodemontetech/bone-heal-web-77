
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PixPayment from "./PixPayment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstallments } from "@/hooks/use-installments";

interface PaymentTabsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  processPayment: () => void;
  isProcessing: boolean;
  pixCode: string;
  pixQrCodeImage: string;
  orderId?: string;
  cartTotal: number;
}

const PaymentTabs = ({
  paymentMethod,
  setPaymentMethod,
  processPayment,
  isProcessing,
  pixCode,
  pixQrCodeImage,
  orderId,
  cartTotal
}: PaymentTabsProps) => {
  const { installments } = useInstallments(cartTotal, 12);
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Detectar bandeira do cartão
  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    
    return null;
  };
  
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';
    
    for (let i = 0; i < cleaned.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    return formatted;
  };
  
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length > 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    
    return cleaned;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };

  const cardBrand = getCardBrand(cardNumber);

  return (
    <>
      <Tabs defaultValue="pix" className="w-full" onValueChange={setPaymentMethod}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pix" className="flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            <span>PIX</span>
          </TabsTrigger>
          <TabsTrigger value="credit_card" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span>Cartão</span>
          </TabsTrigger>
          <TabsTrigger value="standard" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span>Checkout MP</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pix">
          <PixPayment 
            pixCode={pixCode} 
            pixQrCodeImage={pixQrCodeImage}
            orderId={orderId}
          />
        </TabsContent>
        
        <TabsContent value="credit_card">
          <div className="space-y-4 p-4 bg-white rounded-md border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Dados do Cartão</h3>
              {cardBrand && <span className="text-sm text-gray-500">{cardBrand}</span>}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber} 
                  onChange={handleCardNumberChange}
                  maxLength={19}
                />
              </div>
              
              <div>
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input 
                  id="cardName" 
                  placeholder="Nome como está no cartão" 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cardExpiry">Validade</Label>
                  <Input 
                    id="cardExpiry" 
                    placeholder="MM/AA" 
                    value={cardExpiry} 
                    onChange={handleExpiryChange}
                    maxLength={5}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input 
                    id="cardCvv" 
                    placeholder="123" 
                    value={cardCvv} 
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="installments">Parcelas</Label>
              <select 
                id="installments"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedInstallment}
                onChange={(e) => setSelectedInstallment(Number(e.target.value))}
              >
                {installments.map(installment => (
                  <option key={installment.number} value={installment.number}>
                    {installment.number}x de R$ {installment.value.toFixed(2)}
                    {installment.number === 1 ? ' (sem juros)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seus dados são criptografados e processados com segurança
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="standard">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Você será redirecionado para a página de pagamento do MercadoPago, onde poderá escolher entre diversas formas de pagamento.
            </p>
            
            <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Após finalizar o pagamento no MercadoPago, você retornará automaticamente para nossa loja.
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          className="w-full h-12"
          onClick={processPayment}
          disabled={isProcessing || !!pixCode}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : pixCode ? (
            <>Pagamento PIX gerado</>
          ) : (
            <>Finalizar compra</>
          )}
        </Button>
      </div>
    </>
  );
};

export default PaymentTabs;
