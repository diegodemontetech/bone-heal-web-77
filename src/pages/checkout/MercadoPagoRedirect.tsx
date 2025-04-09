
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import MercadoPagoRedirectComponent from '@/components/checkout/MercadoPagoRedirect';
import { useCart } from '@/hooks/use-cart';

const MercadoPagoRedirectPage = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Obter detalhes do pedido a partir dos parâmetros de URL ou estado da localização
  const orderId = searchParams.get('orderId') || (location.state?.orderId || 'placeholder');
  const email = searchParams.get('email') || (location.state?.email || '');
  const shippingFee = Number(searchParams.get('shippingFee') || (location.state?.shippingFee || 0));
  const discount = Number(searchParams.get('discount') || (location.state?.discount || 0));
  
  // Analisar itens a partir de string JSON na URL, se disponível, ou usar do estado da localização
  const [items, setItems] = useState<Array<{name: string; price: number; quantity: number}>>([]);
  
  useEffect(() => {
    console.log('Página de redirecionamento MercadoPago montada');
    console.log('Estado da localização:', location.state);
    console.log('Parâmetros de busca:', Object.fromEntries(searchParams.entries()));
    
    // Tentar obter itens do estado da localização primeiro (método preferido)
    if (location.state?.items && Array.isArray(location.state.items)) {
      console.log("Usando itens do estado da localização:", location.state.items);
      setItems(location.state.items);
      return;
    }
    
    // Recorrer a parâmetros de URL se o estado não estiver disponível
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
        console.log("Itens analisados da URL:", parsedItems);
        setItems(Array.isArray(parsedItems) ? parsedItems : []);
      } catch (e) {
        console.error('Erro ao analisar itens:', e);
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
