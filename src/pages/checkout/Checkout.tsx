
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  useEffect(() => {
    // Only redirect if the cart is empty
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    } else {
      // If cart has items, stay on the checkout page
      console.log("Cart has items, staying on checkout page");
    }
  }, [navigate, cartItems]);

  // If we have items, we'll stay on this page
  // In a real implementation, this would render the checkout form
  if (cartItems && cartItems.length > 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Carregando checkout...</p>
        </div>
      </div>
    );
  }

  // This will only show briefly while redirecting to cart
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Redirecionando para o carrinho...</p>
      </div>
    </div>
  );
};

export default Checkout;
