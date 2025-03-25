
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Truck, ArrowRight, Search, MapPin } from "lucide-react";

export interface CartSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  zipCode: string;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculateShipping: () => void;
  isLoading: boolean;
  error: string | null;
  shippingCalculated: boolean;
  onResetShipping: () => void;
  onCheckout: () => void;
  shippingOptions: any[];
  selectedShippingOption: any;
  onShippingOptionChange: (rate: any) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shippingCost,
  total,
  zipCode,
  onZipCodeChange,
  onCalculateShipping,
  isLoading,
  error,
  shippingCalculated,
  onResetShipping,
  onCheckout,
  shippingOptions,
  selectedShippingOption,
  onShippingOptionChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Endereço de Entrega</h3>
        </div>

        <div className="mb-6">
          <div className="mb-2">
            <label htmlFor="zipCode" className="block text-sm text-gray-700 mb-1">
              Digite seu CEP
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  id="zipCode"
                  className="pl-9"
                  placeholder="00000-000"
                  value={zipCode}
                  onChange={onZipCodeChange}
                  maxLength={9}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button
                type="button"
                onClick={onCalculateShipping}
                disabled={isLoading || !zipCode || zipCode.length < 8}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? 'Calculando...' : 'Buscar CEP'}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <a 
              href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              Não sei meu CEP
            </a>
          </div>
        </div>
      </div>

      {shippingCalculated && shippingOptions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Opções de Entrega</h3>
          </div>
          
          <div className="space-y-3">
            {shippingOptions.map((rate) => (
              <div 
                key={rate.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedShippingOption?.id === rate.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onShippingOptionChange(rate)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedShippingOption?.id === rate.id 
                      ? 'border-primary' 
                      : 'border-gray-300'
                  } flex items-center justify-center`}>
                    {selectedShippingOption?.id === rate.id && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rate.label}</p>
                    <p className="text-sm text-gray-500">
                      {rate.days_min === rate.days_max 
                        ? `Entrega em ${rate.days_min} dia(s)` 
                        : `Entrega em ${rate.days_min}-${rate.days_max} dias`}
                    </p>
                  </div>
                  <p className="font-medium text-primary">{formatCurrency(rate.rate)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-primary"
            onClick={onResetShipping}
          >
            Alterar CEP
          </Button>
        </div>
      )}
    </div>
  );
};
