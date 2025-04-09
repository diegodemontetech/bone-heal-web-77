
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentInfoAlert = () => {
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700 text-sm">
        Para sua segurança, você será redirecionado para o ambiente seguro do Mercado Pago para concluir o pagamento.
      </AlertDescription>
    </Alert>
  );
};

export default PaymentInfoAlert;
