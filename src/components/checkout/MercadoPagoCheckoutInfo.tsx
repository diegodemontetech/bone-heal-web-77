
import { Shield, CreditCard, BanknoteIcon } from "lucide-react";

const MercadoPagoCheckoutInfo = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-blue-700">Pagamento seguro com Mercado Pago</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-3">
        Seu pagamento será processado com segurança pelo Mercado Pago, você será redirecionado para concluir a compra.
      </p>
      
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs text-gray-600 border">
          <CreditCard className="h-3 w-3" />
          <span>Cartão de crédito</span>
        </div>
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs text-gray-600 border">
          <BanknoteIcon className="h-3 w-3" />
          <span>Boleto</span>
        </div>
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs text-gray-600 border">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 15H9V9H7V15ZM15 9H17V15H15V9ZM17 5V7H7V5H17ZM12 20.17L17.5 14.67V18H19V12H13V13.5H16.33L12 17.83L9 14.83L4.5 19.33L5.55 20.39L9 16.94L12 20.17Z" fill="currentColor"/>
          </svg>
          <span>PIX</span>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoCheckoutInfo;
