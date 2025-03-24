
import { useState } from "react";
import { CreditCard, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OpcoesCartaoProps {
  isSelected: boolean;
  total: number;
}

const OpcoesCartao = ({ isSelected, total }: OpcoesCartaoProps) => {
  const [parcelas, setParcelas] = useState<number>(1);
  const [cardData, setCardData] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstallmentSelect = (parcela: number) => {
    setParcelas(parcela);
  };

  // Calcular valor das parcelas
  const valorParcela = total / parcelas;

  // Verificar se o cartão é válido (apenas visual)
  const isCardNumberValid = cardData.numero.length >= 16;
  const isCardComplete = cardData.numero && cardData.nome && cardData.validade && cardData.cvv;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-blue-100 p-1.5">
          <CreditCard className="h-4 w-4 text-blue-600" />
        </div>
        <span className="font-medium">Cartão de Crédito</span>
        <span className="text-blue-600 text-sm ml-auto px-2 py-0.5 bg-blue-50 rounded-full">até 12x</span>
      </div>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-4 bg-gradient-to-b from-white to-blue-50 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex justify-between mb-3 pb-2 border-b border-blue-200">
              <span className="text-gray-800 font-medium">Total:</span>
              <span className="font-bold">R$ {total.toFixed(2)}</span>
            </div>
            
            {/* Opções de parcelamento */}
            <div className="mb-4">
              <Label htmlFor="parcelas" className="mb-2 block text-sm font-medium text-gray-700">
                Parcelamento
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((n) => (
                  <Button 
                    key={n}
                    variant={parcelas === n ? "default" : "outline"} 
                    size="sm" 
                    className={parcelas === n ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 bg-white hover:bg-gray-50"}
                    onClick={() => handleInstallmentSelect(n)}
                  >
                    {n}x {n > 1 ? "de " : ""}{n > 1 ? `R$ ${valorParcela.toFixed(2)}` : ""}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[6, 9, 12].map((n) => (
                  <Button 
                    key={n}
                    variant={parcelas === n ? "default" : "outline"} 
                    size="sm" 
                    className={parcelas === n ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 bg-white hover:bg-gray-50"}
                    onClick={() => handleInstallmentSelect(n)}
                  >
                    {n}x {`R$ ${valorParcela.toFixed(2)}`}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Campos de dados do cartão */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="numero" className="text-sm font-medium text-gray-700">
                  Número do Cartão
                </Label>
                <div className="relative">
                  <Input
                    id="numero"
                    name="numero"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.numero}
                    onChange={handleChange}
                    className={`mt-1 ${isCardNumberValid ? 'border-green-300 focus:border-green-400 focus:ring-green-200' : ''}`}
                  />
                  {isCardNumberValid && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome no Cartão
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Como está no cartão"
                  value={cardData.nome}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="validade" className="text-sm font-medium text-gray-700">
                    Validade
                  </Label>
                  <Input
                    id="validade"
                    name="validade"
                    placeholder="MM/AA"
                    value={cardData.validade}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleChange}
                    className="mt-1"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-4 text-xs text-gray-600 gap-1 px-3 py-2 bg-gray-50 rounded">
              <Lock className="h-3 w-3" />
              <span>Seus dados são criptografados e protegidos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpcoesCartao;
