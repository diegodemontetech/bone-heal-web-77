
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export interface ShippingRate {
  rate: number;
  delivery_days: number;
  service_type: string;
  name: string;
}

export function useShipping() {
  const session = useSession();
  const [zipCode, setZipCode] = useState<string>("");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [availableShippingRates, setAvailableShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('zip_code')
          .eq('id', session.user.id)
          .single();

        if (profile?.zip_code) {
          setZipCode(profile.zip_code);
          calculateShipping(profile.zip_code);
        }
      }
    };

    loadUserProfile();
  }, [session]);

  const calculateDeliveryDate = (shippingDays: number) => {
    const date = new Date();
    date.setDate(date.getDate() + shippingDays);
    setDeliveryDate(date);
  };

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 8) {
      return;
    }

    setIsCalculatingShipping(true);
    
    try {
      // Buscar o estado pelo CEP (assumindo um CEP brasileiro de 8 dígitos)
      // Extrair os 2 primeiros dígitos para determinar o estado
      const cepPrefix = zip.substring(0, 2);
      
      // Mapeamento de prefixos de CEP para estados brasileiros
      let state = '';
      
      if (['01', '02', '03', '04', '05', '06', '07', '08', '09'].includes(cepPrefix)) {
        state = 'SP';
      } else if (['20', '21', '22', '23', '24', '25', '26', '27', '28'].includes(cepPrefix)) {
        state = 'RJ';
      } else if (['29'].includes(cepPrefix)) {
        state = 'ES';
      } else if (['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'].includes(cepPrefix)) {
        state = 'MG';
      } else if (['40', '41', '42', '43', '44', '45', '46', '47', '48'].includes(cepPrefix)) {
        state = 'BA';
      } else if (['49'].includes(cepPrefix)) {
        state = 'SE';
      } else if (['50', '51', '52', '53', '54', '55', '56'].includes(cepPrefix)) {
        state = 'PE';
      } else if (['57'].includes(cepPrefix)) {
        state = 'AL';
      } else if (['58'].includes(cepPrefix)) {
        state = 'PB';
      } else if (['59'].includes(cepPrefix)) {
        state = 'RN';
      } else if (['60', '61', '62', '63'].includes(cepPrefix)) {
        state = 'CE';
      } else if (['64'].includes(cepPrefix)) {
        state = 'PI';
      } else if (['65'].includes(cepPrefix)) {
        state = 'MA';
      } else if (['66', '67', '68'].includes(cepPrefix)) {
        state = 'PA';
      } else if (['69'].includes(cepPrefix)) {
        state = 'AM';
      } else if (['70', '71', '72', '73'].includes(cepPrefix)) {
        state = 'DF';
      } else if (['74', '75', '76'].includes(cepPrefix)) {
        state = 'GO';
      } else if (['77'].includes(cepPrefix)) {
        state = 'TO';
      } else if (['78'].includes(cepPrefix)) {
        state = 'MT';
      } else if (['79'].includes(cepPrefix)) {
        state = 'MS';
      } else if (['80', '81', '82', '83', '84', '85', '86', '87'].includes(cepPrefix)) {
        state = 'PR';
      } else if (['88', '89'].includes(cepPrefix)) {
        state = 'SC';
      } else if (['90', '91', '92', '93', '94', '95', '96', '97', '98', '99'].includes(cepPrefix)) {
        state = 'RS';
      }

      // Se não conseguimos determinar o estado pelo CEP, tentamos usar SP como padrão
      if (!state) {
        state = 'SP';
      }

      // Buscar as taxas de frete disponíveis para o estado
      const { data: shippingRates, error } = await supabase
        .from('shipping_rates')
        .select('rate, delivery_days, service_type')
        .eq('state', state);

      if (error) throw error;

      if (shippingRates?.length) {
        // Mapear e formatar as taxas de frete
        const formattedRates = shippingRates.map(rate => ({
          ...rate,
          name: rate.service_type === 'PAC' ? 'Convencional' : 'Express'
        }));
        
        setAvailableShippingRates(formattedRates);
        
        // Inicialmente seleciona o PAC como padrão
        const pacRate = formattedRates.find(rate => rate.service_type === 'PAC');
        if (pacRate) {
          setShippingFee(pacRate.rate);
          calculateDeliveryDate(pacRate.delivery_days);
          setSelectedShippingRate(pacRate);
        }
      } else {
        // Se não encontrou taxas específicas para o estado, exibe mensagem
        toast.error(`Não foi possível calcular o frete para o estado ${state}`);
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      toast.error("Erro ao calcular o frete. Tente novamente mais tarde.");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleShippingRateChange = (rate: ShippingRate) => {
    setShippingFee(rate.rate);
    calculateDeliveryDate(rate.delivery_days);
    setSelectedShippingRate(rate);
  };

  return {
    zipCode,
    setZipCode,
    isCalculatingShipping,
    shippingFee,
    deliveryDate,
    availableShippingRates,
    selectedShippingRate,
    calculateShipping,
    handleShippingRateChange
  };
}
