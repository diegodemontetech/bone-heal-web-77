
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { ShippingCalculationRate } from "@/types/shipping";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShippingSectionProps {
  zipCode: string;
  setZipCode: (value: string) => void;
  selectedShipping: ShippingCalculationRate | null;
  setSelectedShipping: (shipping: ShippingCalculationRate | null) => void;
  customerZipCode?: string;
}

const ShippingSection = ({ 
  zipCode, 
  setZipCode, 
  selectedShipping, 
  setSelectedShipping,
  customerZipCode
}: ShippingSectionProps) => {
  const [shippingOptions, setShippingOptions] = useState<ShippingCalculationRate[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  useEffect(() => {
    if (customerZipCode) {
      setZipCode(customerZipCode);
    }
  }, [customerZipCode, setZipCode]);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover caracteres não numéricos
    const value = e.target.value.replace(/\D/g, '');
    
    // Aplicar máscara de CEP (00000-000)
    let maskedValue = value;
    if (value.length > 5) {
      maskedValue = value.substring(0, 5) + '-' + value.substring(5);
    }
    
    setZipCode(maskedValue.substring(0, 9));
  };

  const calculateShipping = async () => {
    if (!zipCode || zipCode.length < 8) {
      toast.error("CEP inválido");
      return;
    }

    setIsCalculatingShipping(true);
    
    try {
      // Buscar frete da tabela shipping_rates
      const cleanZipCode = zipCode.replace(/\D/g, '');
      const { data, error } = await supabase
        .from('shipping_rates')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;

      // Filtrar opções de frete aplicáveis para o CEP
      let applicableRates: ShippingCalculationRate[] = [];
      
      if (data && data.length > 0) {
        // Pegar o estado do CEP (os dois primeiros dígitos determinam o estado)
        const zipPrefix = cleanZipCode.substring(0, 2);
        
        // Mapeamento de prefixos de CEP para estados brasileiros
        const zipPrefixToState: Record<string, string> = {
          '01': 'SP', '02': 'SP', '03': 'SP', '04': 'SP', '05': 'SP',
          '06': 'SP', '07': 'SP', '08': 'SP', '09': 'SP',
          '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP',
          '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
          '20': 'RJ', '21': 'RJ', '22': 'RJ', '23': 'RJ', '24': 'RJ',
          '25': 'RJ', '26': 'RJ', '27': 'RJ', '28': 'RJ',
          '29': 'ES',
          '30': 'MG', '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG',
          '35': 'MG', '36': 'MG', '37': 'MG', '38': 'MG', '39': 'MG',
          '40': 'BA', '41': 'BA', '42': 'BA', '43': 'BA', '44': 'BA',
          '45': 'BA', '46': 'BA', '47': 'BA', '48': 'BA',
          '49': 'SE',
          '50': 'PE', '51': 'PE', '52': 'PE', '53': 'PE', '54': 'PE',
          '55': 'PE', '56': 'PE',
          '57': 'AL',
          '58': 'PB',
          '59': 'RN',
          '60': 'CE', '61': 'CE', '62': 'CE', '63': 'CE',
          '64': 'PI',
          '65': 'MA', '66': 'MA',
          '67': 'PA', '68': 'PA',
          '69': 'AM',
          '70': 'DF', '71': 'DF', '72': 'DF', '73': 'DF',
          '74': 'GO', '75': 'GO', '76': 'GO',
          '77': 'TO',
          '78': 'MT', '79': 'MS',
          '80': 'PR', '81': 'PR', '82': 'PR', '83': 'PR', '84': 'PR',
          '85': 'PR', '86': 'PR', '87': 'PR',
          '88': 'SC', '89': 'SC',
          '90': 'RS', '91': 'RS', '92': 'RS', '93': 'RS', '94': 'RS',
          '95': 'RS', '96': 'RS', '97': 'RS', '98': 'RS', '99': 'RS'
        };
        
        const state = zipPrefixToState[zipPrefix] || 'OUTRO';
        
        // Filtrar as opções de frete pelo estado
        const stateOptions = data.filter(rate => {
          return rate.state === state || rate.state === '*';
        });
        
        if (stateOptions.length > 0) {
          // Formatar para o formato esperado
          applicableRates = stateOptions.map(rate => ({
            rate: rate.flat_rate || 0,
            delivery_days: rate.estimated_days || 5,
            service_type: rate.service_type || 'PAC',
            name: `Frete ${rate.service_type || 'Padrão'} - ${rate.region || state}`,
            id: rate.id,
            region: rate.region,
            estimated_days: rate.estimated_days
          }));
        } else {
          // Usar opção padrão
          applicableRates = [
            {
              rate: 30,
              delivery_days: 7,
              service_type: 'PAC',
              name: 'Frete Padrão',
              zipCode: cleanZipCode
            }
          ];
        }
      } else {
        // Opções padrão se não houver configurações
        applicableRates = [
          {
            rate: 30,
            delivery_days: 7,
            service_type: 'PAC',
            name: 'Frete Padrão',
            zipCode: cleanZipCode
          }
        ];
      }
      
      // Ordenar por preço
      applicableRates.sort((a, b) => a.rate - b.rate);
      
      setShippingOptions(applicableRates);
      
      // Selecionar a opção mais barata por padrão
      if (applicableRates.length > 0 && !selectedShipping) {
        setSelectedShipping(applicableRates[0]);
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast.error('Erro ao calcular frete. Tente novamente.');
      
      // Fornecer algumas opções padrão para não bloquear o usuário
      const fallbackOptions = [
        {
          rate: 30,
          delivery_days: 7,
          service_type: 'PAC',
          name: 'Frete Padrão',
          zipCode: zipCode.replace(/\D/g, '')
        }
      ];
      
      setShippingOptions(fallbackOptions);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Frete</Label>
      
      <div className="flex space-x-2">
        <Input
          placeholder="CEP"
          value={zipCode}
          onChange={handleZipCodeChange}
          maxLength={9}
          className="max-w-[120px]"
        />
        <Button 
          variant="outline" 
          onClick={calculateShipping} 
          disabled={isCalculatingShipping || !zipCode || zipCode.length < 8}
          type="button"
          size="sm"
        >
          {isCalculatingShipping ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calcular'}
        </Button>
      </div>
      
      {shippingOptions.length > 0 && (
        <RadioGroup
          value={selectedShipping?.id || ''}
          onValueChange={(value) => {
            const selected = shippingOptions.find(option => option.id === value);
            setSelectedShipping(selected || null);
          }}
          className="mt-3"
        >
          {shippingOptions.map((option, index) => (
            <div key={option.id || index} className="flex items-center space-x-2 border p-2 rounded">
              <RadioGroupItem value={option.id || String(index)} id={`shipping-${index}`} />
              <Label htmlFor={`shipping-${index}`} className="flex-1 flex justify-between items-center cursor-pointer">
                <div>
                  <span className="font-medium">{option.name}</span>
                  <p className="text-sm text-muted-foreground">
                    Entrega em até {option.delivery_days} dias úteis
                  </p>
                </div>
                <span className="font-bold">{formatCurrency(option.rate)}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default ShippingSection;
