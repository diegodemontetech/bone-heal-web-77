
import { CreditCard, QrCode, Landmark, Shield } from "lucide-react";

const MercadoPagoCheckoutInfo = () => {
  return (
    <div>
      <h3 className="font-medium mb-3">Formas de Pagamento Disponíveis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-start space-x-2 p-3 border rounded-md">
          <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <span className="font-medium text-sm">Cartão de Crédito</span>
            <p className="text-xs text-gray-500">Parcele em até 12x</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 p-3 border rounded-md">
          <QrCode className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <span className="font-medium text-sm">PIX</span>
            <p className="text-xs text-gray-500">Pagamento instantâneo</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 p-3 border rounded-md">
          <Landmark className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <span className="font-medium text-sm">Boleto Bancário</span>
            <p className="text-xs text-gray-500">Aprovação em 1-3 dias úteis</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md border flex items-start">
        <Shield className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
        <p className="text-xs text-gray-600">
          Seus dados estão protegidos e o pagamento será processado em ambiente seguro do Mercado Pago.
        </p>
      </div>
    </div>
  );
};

export default MercadoPagoCheckoutInfo;
