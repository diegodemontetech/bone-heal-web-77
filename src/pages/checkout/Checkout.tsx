
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the cart page since we've merged cart and checkout
    navigate('/cart');
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Redirecionando para o checkout unificado...</p>
      </div>
    </div>
  );
};

export default Checkout;
