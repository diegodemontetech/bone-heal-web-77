
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import CheckoutLoader from "@/components/checkout/CheckoutLoader";
import CheckoutLayout from "@/components/checkout/CheckoutLayout";
import CheckoutContent from "@/components/checkout/CheckoutContent";
import { usePaymentProcessor } from "@/components/checkout/PaymentProcessor";

const Checkout = () => {
  const { cartItems, total: cartTotal, clear } = useCart();
  const { profile, isLoading: profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [pixCode, setPixCode] = useState("");
  const [pixQrCodeImage, setPixQrCodeImage] = useState("");
  
  // Obter informações de frete passadas do carrinho
  const shippingInfo = location.state?.shipping || null;

  // Hook personalizado para processamento de pagamento
  const { processPayment, isProcessing } = usePaymentProcessor({
    cartItems,
    total: cartTotal,
    profile,
    shippingInfo,
    paymentMethod,
    setPixCode,
    setPixQrCodeImage
  });

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
    return <CheckoutLoader />;
  }

  return (
    <CheckoutLayout>
      <CheckoutContent
        cartItems={cartItems}
        cartTotal={cartTotal}
        shippingInfo={shippingInfo}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        processPayment={processPayment}
        isProcessing={isProcessing}
        pixCode={pixCode}
        pixQrCodeImage={pixQrCodeImage}
      />
    </CheckoutLayout>
  );
};

export default Checkout;
