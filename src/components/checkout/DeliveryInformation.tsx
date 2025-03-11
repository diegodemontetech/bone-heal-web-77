import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Truck, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ShippingOptions from './shipping/ShippingOptions';
import { ShippingCalculationRate } from '@/types/shipping';

interface DeliveryInformationProps {
  address: any;
  onShippingRateChange: (rate: ShippingCalculationRate | null) => void;
  selectedShippingRate: ShippingCalculationRate | null;
}

const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
  address,
  onShippingRateChange,
  selectedShippingRate
}) => {
  const session = useSession();
  const [zipCode, setZipCode] = useState<string>('');
  const [shippingRates, setShippingRates] = useState<ShippingCalculationRate[]>([]);
  const [loadingRates, setLoadingRates] = useState<boolean>(false);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);

  useEffect(() => {
    if (address?.zip_code) {
      setZipCode(address.zip_code);
      calculateShipping(address.zip_code);
    }
  }, [address]);

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 8) {
      toast.error('Por favor, informe um CEP válido com 8 dígitos');
      return;
    }

    setLoadingRates(true);
    
    try {
      // Fetch shipping rates from database based on ZIP code
      const { data, error } = await supabase
        .from('shipping_rates')
        .select('*')
        .eq('is_active', true)
        .lte('zip_code_start', zip)
        .gte('zip_code_end', zip);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        // No specific rates for this ZIP range, get default rates
        const { data: defaultRates, error: defaultError } = await supabase
          .from('shipping_rates')
          .select('*')
          .eq('is_active', true)
          .eq('region', 'Sudeste'); // Default to Southeast region
          
        if (defaultError) throw defaultError;
        
        if (!defaultRates || defaultRates.length === 0) {
          toast.error('Não encontramos opções de entrega para seu CEP');
          setShippingRates([]);
          onShippingRateChange(null);
          return;
        }
        
        // Convert to ShippingCalculationRate
        const processedDefaultRates: ShippingCalculationRate[] = defaultRates.map(rate => ({
          id: rate.id,
          region: rate.region,
          zip_code_start: rate.zip_code_start,
          zip_code_end: rate.zip_code_end,
          flat_rate: rate.flat_rate,
          additional_kg_rate: rate.additional_kg_rate,
          estimated_days: rate.estimated_days,
          is_active: rate.is_active,
          
          // Campos para compatibilidade com o componente ShippingOptions
          service_type: rate.id,
          name: `${rate.region} - Entrega padrão`,
          rate: rate.flat_rate,
          delivery_days: rate.estimated_days,
          zipCode: zip
        }));
        
        setShippingRates(processedDefaultRates);
        onShippingRateChange(processedDefaultRates[0]);
        return;
      }
      
      // Convert to ShippingCalculationRate
      const processedRates: ShippingCalculationRate[] = data.map(rate => ({
        id: rate.id,
        region: rate.region,
        zip_code_start: rate.zip_code_start,
        zip_code_end: rate.zip_code_end,
        flat_rate: rate.flat_rate,
        additional_kg_rate: rate.additional_kg_rate,
        estimated_days: rate.estimated_days,
        is_active: rate.is_active,
        
        // Campos para compatibilidade com o componente ShippingOptions
        service_type: rate.id,
        name: `${rate.region} - Entrega padrão`,
        rate: rate.flat_rate,
        delivery_days: rate.estimated_days,
        zipCode: zip
      }));
      
      // Sort by price (cheapest first)
      processedRates.sort((a, b) => a.rate - b.rate);
      
      setShippingRates(processedRates);
      onShippingRateChange(processedRates[0]);
      
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast.error('Erro ao calcular o frete. Por favor, tente novamente.');
      setShippingRates([]);
      onShippingRateChange(null);
    } finally {
      setLoadingRates(false);
    }
  };

  const loadUserAddress = async () => {
    if (!session?.user?.id) {
      toast.error('Você precisa estar logado para carregar seu endereço');
      return;
    }

    setLoadingAddress(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('street, number, neighborhood, city, state, zip_code')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      if (data && data.zip_code) {
        setZipCode(data.zip_code);
        calculateShipping(data.zip_code);
      } else {
        toast.error('Endereço não encontrado em seu perfil');
      }
      
    } catch (error) {
      console.error('Erro ao carregar endereço:', error);
      toast.error('Erro ao carregar seu endereço');
    } finally {
      setLoadingAddress(false);
    }
  };

  const formatZipCode = (zipCode: string) => {
    if (!zipCode) return "";
    const cleanedZipCode = zipCode.replace(/\D/g, '');
    if (cleanedZipCode.length === 8) {
      return `${cleanedZipCode.substring(0, 5)}-${cleanedZipCode.substring(5)}`;
    }
    return cleanedZipCode;
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" /> Informações de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="zipCode" className="mb-2 block">CEP</Label>
            <div className="flex space-x-2">
              <Input
                id="zipCode"
                placeholder="00000-000"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').substring(0, 8))}
                maxLength={8}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => calculateShipping(zipCode)}
              >
                Calcular
              </Button>
              <Button 
                variant="outline" 
                onClick={loadUserAddress} 
                disabled={loadingAddress}
              >
                {loadingAddress ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Usar meu endereço'}
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <ShippingOptions
              shippingRates={shippingRates}
              selectedShippingRate={selectedShippingRate}
              onShippingRateChange={onShippingRateChange}
              shippingLoading={loadingRates}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryInformation;
