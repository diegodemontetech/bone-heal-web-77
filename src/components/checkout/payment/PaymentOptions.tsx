
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, QrCode, Copy } from "lucide-react";
import { useInstallments } from "@/hooks/use-installments";
import { toast } from "sonner";

interface PaymentOptionsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  total: number;
  checkoutData: any;
}

const PaymentOptions = ({ paymentMethod, setPaymentMethod, total, checkoutData }: PaymentOptionsProps) => {
  const pixDiscount = total * 0.05; // 5% de desconto no PIX
  const { installments } = useInstallments(total, 12);
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  
  // Detectar bandeira do cartão
  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    
    return null;
  };
  
  const cardBrand = getCardBrand(cardNumber);
  
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
  
  // Dados do PIX
  const pixQrCode = checkoutData?.point_of_interaction?.transaction_data?.qr_code || "";
  const pixCode = checkoutData?.point_of_interaction?.transaction_data?.qr_code_base64 || "";
  
  const copyPixCode = () => {
    if (!pixQrCode) {
      toast.error("Código PIX não disponível. Gere o QR Code primeiro.");
      return;
    }
    
    navigator.clipboard.writeText(pixQrCode)
      .then(() => toast.success("Código PIX copiado!"))
      .catch(() => toast.error("Erro ao copiar código PIX"));
  };
  
  return (
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
              {cardBrand && <span className="ml-auto text-sm text-gray-500">{cardBrand}</span>}
            </div>
            
            {paymentMethod === 'credit' && (
              <div className="mt-4 space-y-3">
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
                      </option>
                    ))}
                  </select>
                </div>
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
              <div className="mt-4">
                <div className="p-3 bg-green-50 rounded border border-green-100">
                  <div className="flex justify-between mb-2">
                    <span>Total com desconto:</span>
                    <span className="text-green-600 font-medium">
                      R$ {(total - pixDiscount).toFixed(2)}
                    </span>
                  </div>
                  
                  {pixCode ? (
                    <div className="flex flex-col items-center mt-3">
                      <div className="mb-3 p-2 bg-white rounded">
                        {pixCode ? (
                          <img 
                            src={`data:image/png;base64,${pixCode}`} 
                            alt="QR Code PIX" 
                            className="w-48 h-48"
                          />
                        ) : (
                          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {pixQrCode && (
                        <div className="flex items-center gap-2 w-full">
                          <Input 
                            value={pixQrCode} 
                            readOnly 
                            className="text-xs font-mono"
                          />
                          <Button size="sm" variant="outline" onClick={copyPixCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-xs text-center text-gray-600 mt-2">
                        Abra o app do seu banco, escaneie o QR Code ou cole o código PIX para pagar
                      </p>
                      <p className="text-xs text-center font-medium text-red-500 mt-1">
                        Este código expira em 5 minutos
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 py-3">
                      <p className="text-sm text-center">
                        Clique em "Gerar PIX" abaixo para gerar o QR Code PIX
                      </p>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                        onClick={() => {
                          toast.info("Gerando QR Code PIX...");
                          // A geração real acontecerá no hook useCheckout quando o método de pagamento mudar
                        }}
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Gerar PIX
                      </Button>
                      <div className="animate-pulse w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-gray-300" />
                      </div>
                    </div>
                  )}
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
              <div className="mt-4">
                <div className="p-3 bg-blue-50 rounded border border-blue-100">
                  <div className="flex justify-between mb-2">
                    <span>Total:</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  
                  {checkoutData?.transaction_details?.external_resource_url ? (
                    <div className="mt-3">
                      <Button className="w-full" variant="outline" asChild>
                        <a 
                          href={checkoutData.transaction_details.external_resource_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          Imprimir Boleto
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 py-3">
                      <p className="text-sm text-center">
                        Clique em "Gerar Boleto" para gerar o boleto bancário
                      </p>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                        onClick={() => {
                          toast.info("Gerando boleto...");
                          // A geração real acontecerá no hook useCheckout quando o método de pagamento mudar
                        }}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Gerar Boleto
                      </Button>
                      <div className="animate-pulse w-full h-10 bg-gray-200 rounded"></div>
                    </div>
                  )}
                  
                  <p className="text-xs text-center text-gray-600 mt-2">
                    O boleto será gerado e poderá ser pago em qualquer agência bancária ou internet banking
                  </p>
                  <p className="text-xs text-center font-medium text-gray-500 mt-1">
                    O boleto vence em 3 dias úteis
                  </p>
                </div>
              </div>
            )}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentOptions;
