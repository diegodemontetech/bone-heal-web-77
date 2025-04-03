
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserZipCode } from "@/hooks/shipping/use-user-zip-code";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading, getTotalPrice } = useCart();
  const { profile, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const { zipCode, loadUserZipCode } = useUserZipCode();
  
  console.log("CartPage renderizando, itens:", cartItems?.length, "isLoading:", isLoading);
  
  // Load user profile data if authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && profile?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profile.id)
            .single();
          
          if (error) throw error;
          if (data) {
            setUserProfile(data);
            
            // If user has a ZIP code, ensure it's loaded
            if (data.zip_code && !zipCode) {
              await loadUserZipCode();
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, profile]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Aguardar o carregamento completo antes de verificar itens
  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando seu carrinho...</p>
        </div>
      </div>
    );
  }

  // Verify cart has items
  if (!cartItems || cartItems.length === 0) {
    console.log("Carrinho vazio, exibindo EmptyCart");
    return <EmptyCart />;
  }

  // Display cart items with direct checkout button
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-2xl font-bold mb-6">Meu Carrinho</h2>
            
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <div className="h-24 w-24 bg-gray-50 rounded-md border overflow-hidden flex-shrink-0">
                    <img 
                      src={`/products/${item.image}`} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base">{item.name}</h3>
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                        <p className="font-medium">{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border sticky top-20">
            <h3 className="text-lg font-bold mb-4">Resumo do Pedido</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{getTotalPrice().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>Calculado no checkout</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{getTotalPrice().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium" 
              size="lg"
              onClick={handleCheckout}
            >
              Finalizar Compra
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Os detalhes de frete e pagamento serão calculados automaticamente no checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
