
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Falha no Pagamento</h1>
              <p className="text-gray-600 mb-6">
                Houve um problema ao processar seu pagamento.
                <br />
                Por favor, tente novamente ou entre em contato conosco.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/cart")} 
                  className="w-full"
                >
                  Voltar ao Carrinho
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/contact")}
                  className="w-full"
                >
                  Falar com Suporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Failure;
