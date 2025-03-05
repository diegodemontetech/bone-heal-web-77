
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

interface PaymentRedirectProps {
  paymentUrl: string;
}

const PaymentRedirect = ({ paymentUrl }: PaymentRedirectProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle>Pedido realizado com sucesso!</AlertTitle>
            <AlertDescription className="mt-2">
              Seu pedido foi registrado. Agora você será redirecionado para concluir o pagamento.
            </AlertDescription>
          </Alert>
          
          <div className="text-center space-y-6 p-6 border rounded-lg bg-white">
            <p className="text-lg">Você será redirecionado para a página de pagamento em instantes...</p>
            <Button 
              onClick={() => window.location.href = paymentUrl}
              className="bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Ir para pagamento agora
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
