
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useEffect, useState } from "react";

interface PaymentRedirectProps {
  paymentUrl: string;
}

const PaymentRedirect = ({ paymentUrl }: PaymentRedirectProps) => {
  const [countdown, setCountdown] = useState(5);

  // Redirecionar automaticamente após 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = paymentUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentUrl]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle>Pedido realizado com sucesso!</AlertTitle>
            <AlertDescription className="mt-2">
              Seu pedido foi registrado. Agora você será redirecionado para a página de pagamento seguro do Mercado Pago.
            </AlertDescription>
          </Alert>
          
          <div className="text-center space-y-6 p-6 border rounded-lg bg-white">
            <p className="text-lg">Você será redirecionado em {countdown} segundos...</p>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
              <p className="text-sm text-gray-700 mb-3">
                Você será direcionado para o ambiente seguro do Mercado Pago para concluir seu pagamento.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <img src="https://www.mercadopago.com/org-img/Manual/ManualMP/imgs/isologoHorizontal.png" alt="Mercado Pago" className="h-6" />
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = paymentUrl}
              className="bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Ir para pagamento agora
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default PaymentRedirect;
