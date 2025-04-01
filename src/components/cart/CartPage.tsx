
import { useCart } from "@/hooks/use-cart";
import { useShipping } from "@/hooks/use-shipping";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth-context";
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
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, profile]);

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

  // Verify cart has items before continuing
  if (!cartItems || cartItems.length === 0) {
    console.log("Carrinho vazio, exibindo EmptyCart");
    return <EmptyCart />;
  }

  console.log("Exibindo conteúdo do carrinho, itens:", cartItems.length);
  return <CartContent userProfile={userProfile} />;
};

export default CartPage;
