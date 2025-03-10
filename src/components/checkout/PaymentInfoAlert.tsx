
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PaymentInfoAlert = () => {
  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Informação de Pagamento</AlertTitle>
      <AlertDescription>
        O pagamento será processado através do MercadoPago. Você será redirecionado para a página
        de pagamento após clicar em "Finalizar compra".
      </AlertDescription>
    </Alert>
  );
};

export default PaymentInfoAlert;
