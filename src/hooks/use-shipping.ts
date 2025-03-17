
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { CartItem } from "@/hooks/use-cart";

// Dados de frete mockados para garantir que a aplicação nunca quebra
const MOCK_SHIPPING_RATES = [
  {
    id: 'sedex',
    service_type: 'SEDEX',
    name: 'SEDEX - Entrega expressa',
    rate: 29.90,
    delivery_days: 2,
    zipCode: '00000000'
  },
  {
    id: 'pac',
    service_type: 'PAC',
    name: 'PAC - Entrega econômica',
    rate: 19.90,
    delivery_days: 6,
    zipCode: '00000000'
  }
];

export const useShipping = (cartItems: CartItem[] = []) => {
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [zipCodeFetched, setZipCodeFetched] = useState(false);
  const calculationInProgress = useRef(false);
  const session = useSession();
  const lastCalculatedZipCode = useRef("");
  const cartItemsRef = useRef(cartItems);
  const maxRetries = useRef(3);
  const retryCount = useRef(0);

  // Atualizar a referência quando cartItems mudar
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Função para buscar o CEP do usuário
  const fetchUserZipCode = async () => {
    if (!session?.user?.id) {
      console.log('Sessão não disponível para busca de CEP');
      return null;
    }
    
    try {
      console.log('Buscando CEP para o usuário:', session.user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('zip_code, address')
        .eq('id', session.user.id)
        .single();
        
      console.log('Perfil recuperado:', profile);
      
      if (error) {
        console.error('Erro ao buscar CEP do usuário:', error);
        return null;
      }
      
      // Marcar que já buscamos o CEP para evitar buscas repetidas
      setZipCodeFetched(true);
      
      // Verificar CEP diretamente no perfil
      if (profile?.zip_code && profile.zip_code.length >= 8) {
        console.log('CEP encontrado no perfil:', profile.zip_code);
        return profile.zip_code.replace(/\D/g, ''); // Garante que só retorna números
      }
      
      // Verificar se o CEP está no campo de endereço
      if (profile && profile.address && typeof profile.address === 'object') {
        const address = profile.address as Record<string, any>;
        if ('postal_code' in address && address.postal_code) {
          const postalCode = String(address.postal_code);
          console.log('CEP encontrado no endereço:', postalCode);
          return postalCode.replace(/\D/g, '');
        }
      }
      
      console.log('Nenhum CEP válido encontrado para o usuário');
      return null;
    } catch (error) {
      console.error('Erro inesperado ao buscar CEP:', error);
      return null;
    }
  };

  // Função para calcular o frete usando a Edge Function
  const calculateShipping = async (zipCodeInput: string) => {
    // Verificar parâmetros de entrada
    if (!zipCodeInput) {
      console.log("CEP não fornecido para cálculo");
      return;
    }
    
    // Limpar o CEP para ter apenas números
    const cleanZipCode = zipCodeInput.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      console.log("CEP inválido para cálculo (deve ter 8 dígitos):", cleanZipCode);
      return;
    }
    
    // Evitar recálculos para o mesmo CEP
    if (lastCalculatedZipCode.current === cleanZipCode && shippingRates.length > 0) {
      console.log("Usando taxas de frete já calculadas para o CEP:", cleanZipCode);
      return;
    }
    
    // Evitar cálculos simultâneos
    if (calculationInProgress.current) {
      console.log("Cálculo de frete já em andamento, ignorando nova solicitação");
      return;
    }
    
    calculationInProgress.current = true;
    setLoading(true);
    retryCount.current = 0;
    
    try {
      console.log(`Calculando frete para CEP: ${cleanZipCode} com ${cartItemsRef.current.length} itens`);
      
      // Preparar itens para envio (incluindo peso)
      const itemsWithWeight = cartItemsRef.current.map(item => ({
        ...item,
        weight: item.weight || 0.5 // Peso padrão de 500g se não especificado
      }));
      
      // Chamada para a Edge Function do Supabase
      let data;
      let error;
      
      try {
        // Verificar se estamos em ambiente de desenvolvimento
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.log('Ambiente de desenvolvimento: simulando cálculo de frete');
          
          // Criar dados simulados, mas com o CEP correto
          data = [
            {
              id: 'sedex',
              service_type: 'SEDEX',
              name: 'SEDEX - Entrega expressa',
              rate: 35.90 + parseFloat((Math.random() * 20).toFixed(2)), // Valor aleatório para simular diferentes CEPs
              delivery_days: 2,
              zipCode: cleanZipCode,
              estimatedDelivery: addDays(new Date(), 2).toISOString().split('T')[0]
            },
            {
              id: 'pac',
              service_type: 'PAC',
              name: 'PAC - Entrega econômica',
              rate: 22.90 + parseFloat((Math.random() * 10).toFixed(2)),
              delivery_days: 6,
              zipCode: cleanZipCode,
              estimatedDelivery: addDays(new Date(), 6).toISOString().split('T')[0]
            }
          ];
          error = null;
        } else {
          // Em produção, fazer a chamada real
          const result = await supabase.functions.invoke('correios-shipping', {
            body: {
              zipCode: cleanZipCode,
              items: itemsWithWeight
            }
          });
          
          data = result.data;
          error = result.error;
        }
      } catch (functionError) {
        console.error("Erro ao chamar a Edge Function:", functionError);
        error = { message: 'Erro ao acessar serviço de cálculo de frete' };
      }
      
      if (error) {
        console.error("Erro na API de frete:", error.message);
        // Em vez de lançar erro, vamos usar dados mockados
        setShippingRates(MOCK_SHIPPING_RATES.map(rate => ({
          ...rate,
          zipCode: cleanZipCode,
          estimatedDelivery: addDays(new Date(), rate.delivery_days).toISOString().split('T')[0]
        })));
        setSelectedShippingRate(MOCK_SHIPPING_RATES[0]);
        lastCalculatedZipCode.current = cleanZipCode;
        return;
      }
    
      console.log("Resposta da API de frete:", data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("Resposta vazia da API de frete, usando dados mockados");
        setShippingRates(MOCK_SHIPPING_RATES);
        setSelectedShippingRate(MOCK_SHIPPING_RATES[0]);
        lastCalculatedZipCode.current = cleanZipCode;
        return;
      }
      
      // Guarda o CEP calculado para evitar recálculos
      lastCalculatedZipCode.current = cleanZipCode;
      
      // Atualizar estado com as taxas recebidas
      setShippingRates(data);
      
      // Seleciona a opção mais barata por padrão
      if (data && data.length > 0) {
        const cheapestRate = data.reduce((prev, curr) => 
          prev.rate < curr.rate ? prev : curr
        );
        setSelectedShippingRate(cheapestRate);
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      
      // Usar imediatamente os dados mockados para evitar tela quebrada
      console.log('Usando dados mockados para o frete devido ao erro');
      setShippingRates(MOCK_SHIPPING_RATES);
      setSelectedShippingRate(MOCK_SHIPPING_RATES[0]);
      lastCalculatedZipCode.current = cleanZipCode;
      
      // Mostrar toast de erro, mas garantir que a UI funcione
      toast.error("Não foi possível calcular o frete exato. Usando estimativa padrão.");
    } finally {
      setLoading(false);
      calculationInProgress.current = false;
    }
  };

  // Efeito para carregar o CEP do usuário - executado quando o componente monta ou a sessão muda
  useEffect(() => {
    const loadUserShipping = async () => {
      if (!session?.user?.id) {
        console.log("Sem sessão de usuário para carregar CEP");
        return;
      }
      
      // Forçar nova busca sempre que a sessão mudar
      setZipCodeFetched(false);
      
      console.log("Iniciando carregamento de CEP do usuário");
      const userZipCode = await fetchUserZipCode();
      
      if (userZipCode && userZipCode.length >= 8) {
        const cleanZipCode = userZipCode.replace(/\D/g, '');
        console.log("CEP do usuário carregado:", cleanZipCode);
        setZipCode(cleanZipCode);
        
        // Calcular o frete imediatamente quando carregar o CEP do usuário
        if (cartItemsRef.current.length > 0) {
          console.log("Calculando frete automaticamente com o CEP do usuário");
          calculateShipping(cleanZipCode);
          
          // Usar valores mockados enquanto aguarda o cálculo real para melhorar UX
          if (shippingRates.length === 0) {
            const mockRatesWithZip = MOCK_SHIPPING_RATES.map(rate => ({
              ...rate,
              zipCode: cleanZipCode
            }));
            setShippingRates(mockRatesWithZip);
            setSelectedShippingRate(mockRatesWithZip[0]);
          }
        }
      } else {
        console.log("Nenhum CEP válido encontrado no perfil do usuário");
      }
    };

    loadUserShipping();
  }, [session?.user?.id]); // Remove zipCodeFetched para recarregar sempre que a sessão mudar

  // Efeito para calcular o frete quando o CEP for definido e tiver o formato correto
  useEffect(() => {
    const cleanZipCode = zipCode?.replace(/\D/g, '') || '';
    
    // Só calcula se tiver CEP válido e não estiver já calculando
    if (cleanZipCode.length === 8 && !calculationInProgress.current && 
        cleanZipCode !== lastCalculatedZipCode.current && cartItemsRef.current.length > 0) {
      calculateShipping(cleanZipCode);
    }
  }, [zipCode, cartItems.length]);

  // Função para mudar a opção de frete selecionada
  const handleShippingRateChange = (rate) => {
    setSelectedShippingRate(rate);
  };

  // Função para limpar/resetar o cálculo
  const resetShipping = () => {
    lastCalculatedZipCode.current = "";
    setShippingRates([]);
    setSelectedShippingRate(null);
  };

  const shippingFee = selectedShippingRate ? selectedShippingRate.rate : 0;
  const deliveryDate = selectedShippingRate ? addDays(new Date(), selectedShippingRate.delivery_days) : null;

  return {
    shippingRates,
    selectedShippingRate,
    loading,
    zipCode,
    setZipCode,
    shippingFee,
    deliveryDate,
    handleShippingRateChange,
    resetShipping,
    calculateShipping,
  };
};
