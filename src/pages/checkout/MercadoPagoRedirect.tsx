
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import MercadoPagoRedirectComponent from '@/components/checkout/MercadoPagoRedirect';
import { useCart } from '@/hooks/use-cart';

const MercadoPagoRedirectPage = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get the order details from URL parameters or location state
  const orderId = searchParams.get('orderId') || (location.state?.orderId || 'placeholder');
  const email = searchParams.get('email') || (location.state?.email || '');
  const shippingFee = Number(searchParams.get('shippingFee') || (location.state?.shippingFee || 0));
  const discount = Number(searchParams.get('discount') || (location.state?.discount || 0));
  
  // Parse items from JSON string in URL if available, or use from location state
  const [items, setItems] = useState<Array<{name: string; price: number; quantity: number}>>([]);
  
  useEffect(() => {
    console.log('MercadoPagoRedirectPage mounted');
    console.log('Location state:', location.state);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Try to get items from location state first (preferred method)
    if (location.state?.items && Array.isArray(location.state.items)) {
      console.log("Using items from location state:", location.state.items);
      setItems(location.state.items);
      return;
    }
    
    // Fall back to URL parameters if state is not available
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
        console.log("Parsed items from URL:", parsedItems);
        setItems(Array.isArray(parsedItems) ? parsedItems : []);
      } catch (e) {
        console.error('Error parsing items:', e);
        setItems([]);
      }
    }
  }, [location.state, searchParams]);

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
