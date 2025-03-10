
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { useInstallments } from "@/hooks/use-installments";

interface CartaoCreditoProps {
  isSelected: boolean;
  total: number;
}

const CartaoCredito = ({ isSelected, total }: CartaoCreditoProps) => {
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

  return (
    <div className="flex items-center gap-2">
      <CreditCard className="h-4 w-4 text-primary" />
      <span>Cartão de Crédito</span>
      {cardBrand && <span className="ml-auto text-sm text-gray-500">{cardBrand}</span>}
      
      {isSelected && (
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
    </div>
  );
};

export default CartaoCredito;
