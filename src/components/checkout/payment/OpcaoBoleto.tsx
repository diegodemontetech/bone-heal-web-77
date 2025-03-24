
import { FileText, Download, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpcaoBoletoProps {
  isSelected: boolean;
  total: number;
  boletoUrl: string | null;
}

const OpcaoBoleto = ({ isSelected, total, boletoUrl }: OpcaoBoletoProps) => {
  // Função para abrir o boleto em uma nova janela
  const openBoleto = () => {
    if (boletoUrl) {
      window.open(boletoUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-orange-100 p-1.5">
          <FileText className="h-4 w-4 text-orange-600" />
        </div>
        <span className="font-medium">Boleto Bancário</span>
        <span className="text-orange-600 text-sm ml-auto px-2 py-0.5 bg-orange-50 rounded-full">
          à vista
        </span>
      </div>
      
      {isSelected && (
        <div className="mt-4">
          <div className="p-4 bg-gradient-to-b from-white to-orange-50 rounded-lg border border-orange-100 shadow-sm">
            <div className="flex justify-between mb-3 pb-2 border-b border-dashed border-orange-200">
              <span className="text-gray-700">Valor do boleto:</span>
              <span className="font-bold">R$ {total.toFixed(2)}</span>
            </div>
            
            {boletoUrl ? (
              <div className="space-y-3 mt-3">
                <div className="bg-white p-3 rounded-lg border border-orange-200 text-center">
                  <FileText className="h-16 w-16 mx-auto text-orange-400 mb-2" />
                  <p className="text-sm font-medium">Seu boleto foi gerado com sucesso!</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={openBoleto}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> Visualizar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={openBoleto}
                  >
                    <Download className="h-4 w-4 mr-1" /> Baixar
                  </Button>
                </div>
                
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">O boleto deve ser pago até a data de vencimento. Após o pagamento, a compensação pode levar até 3 dias úteis.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-600">
                  O boleto será gerado após a finalização do pedido
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Você poderá visualizar e baixar o boleto na tela de confirmação do pedido
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpcaoBoleto;
