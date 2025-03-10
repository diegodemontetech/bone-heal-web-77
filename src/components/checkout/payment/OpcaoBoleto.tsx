
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

interface OpcaoBoletoProps {
  isSelected: boolean;
  total: number;
  boletoUrl: string | null;
}

const OpcaoBoleto = ({ isSelected, total, boletoUrl }: OpcaoBoletoProps) => {
  return (
    <div className="flex items-center gap-2">
      <Wallet className="h-4 w-4 text-primary" />
      <span>Boleto Bancário</span>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-3 bg-blue-50 rounded border border-blue-100">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-medium">R$ {total.toFixed(2)}</span>
            </div>
            
            {boletoUrl ? (
              <div className="mt-3">
                <Button className="w-full" variant="outline" asChild>
                  <a 
                    href={boletoUrl} 
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
    </div>
  );
};

export default OpcaoBoleto;
