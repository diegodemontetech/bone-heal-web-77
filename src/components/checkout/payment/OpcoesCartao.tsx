
import { useState } from "react";
import { Wallet, CreditCard } from "lucide-react";
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

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <span>Cartão de Crédito</span>
        <span className="text-sm ml-auto">até 12x</span>
      </div>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-4 bg-gray-50 rounded border border-gray-100 space-y-4">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-medium">R$ {total.toFixed(2)}</span>
            </div>
            
            {/* Opções de parcelamento */}
            <div className="mb-4">
              <Label htmlFor="parcelas" className="mb-2 block text-sm font-medium">
                Parcelamento
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((n) => (
                  <Button 
                    key={n}
                    variant={parcelas === n ? "default" : "outline"} 
                    size="sm" 
                    className={parcelas === n ? "" : "border-gray-300 bg-white hover:bg-gray-50"}
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
                    className={parcelas === n ? "" : "border-gray-300 bg-white hover:bg-gray-50"}
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
                <Label htmlFor="numero" className="text-sm font-medium">
                  Número do Cartão
                </Label>
                <Input
                  id="numero"
                  name="numero"
                  placeholder="0000 0000 0000 0000"
                  value={cardData.numero}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="nome" className="text-sm font-medium">
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
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="validade" className="text-sm font-medium">
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
                  <Label htmlFor="cvv" className="text-sm font-medium">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-600 mt-3">
              Suas informações de pagamento são processadas com segurança
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpcoesCartao;
