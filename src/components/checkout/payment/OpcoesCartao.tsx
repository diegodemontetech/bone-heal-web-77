
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpcoesCartaoProps {
  isSelected: boolean;
  total: number;
}

const OpcoesCartao = ({ isSelected, total }: OpcoesCartaoProps) => {
  return (
    <div className="flex items-center gap-2">
      <Wallet className="h-4 w-4 text-primary" />
      <span>Cartão de Crédito</span>
      <span className="text-sm ml-auto">até 12x</span>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-medium">R$ {total.toFixed(2)}</span>
            </div>
            
            <div className="mt-3">
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-300 bg-white hover:bg-gray-50"
                >
                  1x
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-300 bg-white hover:bg-gray-50"
                >
                  2x
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-300 bg-white hover:bg-gray-50"
                >
                  3x
                </Button>
              </div>
              <p className="text-xs text-center text-gray-600 mt-2">
                Entre com os dados do cartão na próxima etapa
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpcoesCartao;
