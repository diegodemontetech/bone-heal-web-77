
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PaymentInfoAlert = () => {
  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Informação de pagamento</AlertTitle>
      <AlertDescription>
        Após confirmar, você será redirecionado para a plataforma de pagamento para concluir sua compra com segurança.
      </AlertDescription>
    </Alert>
  );
};

export default PaymentInfoAlert;
