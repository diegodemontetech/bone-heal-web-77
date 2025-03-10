
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { cartItems, total: cartTotal } = useCart();
  const { profile, isLoading: profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Obter informações de frete passadas do carrinho
  const shippingInfo = location.state?.shipping || null;

  useEffect(() => {
    // Verifica se tem itens no carrinho
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      navigate("/cart");
      return;
    }

    // Verifica se o usuário está logado
    if (!profile && !profileLoading) {
      toast.error("É necessário estar logado para acessar o checkout");
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [cartItems.length, profile, navigate, profileLoading]);

  // Se estiver carregando o perfil, mostrar loader
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando suas informações...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Checkout</h1>
        </div>
        <Separator className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 mb-6">
                  <p className="text-yellow-800">
                    Esta é uma página temporária de checkout. Por favor, entre em contato com o suporte se precisar de assistência.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md flex items-center space-x-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Pagamento via PIX</h3>
                      <p className="text-sm text-gray-600">
                        Processando o pagamento...
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>
                      {shippingInfo?.cost 
                        ? `R$ ${shippingInfo.cost.toFixed(2)}` 
                        : "Calculando..."}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      R$ {(cartTotal + (shippingInfo?.cost || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Checkout;
