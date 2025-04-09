
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MercadoPagoRedirectComponent from '@/components/checkout/MercadoPagoRedirect';
import { useCart } from '@/hooks/use-cart';

const MercadoPagoRedirectPage = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  
  // Get the order details from URL parameters
  const orderId = searchParams.get('orderId') || 'placeholder';
  const email = searchParams.get('email') || '';
  const shippingFee = Number(searchParams.get('shippingFee') || '0');
  const discount = Number(searchParams.get('discount') || '0');
  
  // Parse items from JSON string in URL if available
  const [items, setItems] = useState<Array<{name: string; price: number; quantity: number}>>([]);
  
  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
        setItems(Array.isArray(parsedItems) ? parsedItems : []);
      } catch (e) {
        console.error('Error parsing items:', e);
        setItems([]);
      }
    }
    
    // Clear cart after successful redirect to payment
    // Commenting out the cart clearing temporarily to fix the issue
    // clearCart();
  }, [searchParams, clearCart]);

  return (
    <MercadoPagoRedirectComponent
      orderId={orderId}
      items={items}
      shippingFee={shippingFee}
      discount={discount}
      email={email}
    />
  );
};

export default MercadoPagoRedirectPage;
