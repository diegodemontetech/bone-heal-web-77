
import { useCart } from "@/hooks/use-cart";
import { useShipping } from "@/hooks/use-shipping";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCheckout } from "@/hooks/use-checkout";
import { EmptyCart } from "@/components/cart/EmptyCart";
import CartContent from "@/components/cart/CartContent";
import { Loader2 } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading } = useCart();
  const { profile, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  
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
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, profile]);

  // Show loading state while cart is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando seu carrinho...</p>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  // Verify cart has items before continuing
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12">
          <EmptyCart />
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
          <p className="text-muted-foreground mb-8">Complete os dados de entrega e pagamento para finalizar seu pedido.</p>
          <CartContent userProfile={userProfile} />
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CartPage;
