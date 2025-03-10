
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Success = () => {
  const { clear } = useCart();
  const navigate = useNavigate();

  // Limpar o carrinho quando a página for carregada
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Pedido Finalizado</h1>
        </div>
        <Separator className="mb-8" />

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Seu pedido foi recebido!</h2>
              <p className="text-gray-600 mb-6">
                Obrigado por sua compra. Seu pedido foi processado com sucesso.
              </p>
              
              <div className="bg-gray-100 w-full p-4 rounded-md mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  Em breve você receberá um e-mail com os detalhes do seu pedido.
                </p>
                <p className="text-sm text-gray-600">
                  Você também pode acompanhar o status do seu pedido na página "Meus Pedidos".
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  className="flex-1"
                  onClick={() => navigate("/orders")}
                  variant="outline"
                >
                  Ver Meus Pedidos
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => navigate("/products")}
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Success;
